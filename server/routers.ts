import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import { 
  getDonorByUserId, 
  getInventoryByBloodType, 
  getAvailableInventoryByBloodType,
  createAuditLog,
  getHospitalRequestsPending,
  createNotification,
  getDb
} from "./db";
import { donors, bloodInventory, hospitalRequests, auditLogs, bloodMatches, notifications } from "../drizzle/schema";
import { eq, and } from "drizzle-orm";

export const appRouter = router({
  system: systemRouter,
  
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Donor operations
  donor: router({
    register: protectedProcedure
      .input(z.object({
        bloodType: z.enum(["O-", "O+", "A-", "A+", "B-", "B+", "AB-", "AB+"]),
        dateOfBirth: z.date(),
        phone: z.string(),
        address: z.string(),
        medicalHistory: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");
        
        const result = await db.insert(donors).values({
          userId: ctx.user!.id,
          bloodType: input.bloodType,
          dateOfBirth: input.dateOfBirth,
          phone: input.phone,
          address: input.address,
          medicalHistory: input.medicalHistory,
          isEligible: true,
        });

        const donorId = (result as any).insertId || 0;
        await createAuditLog(ctx.user!.id, "DONOR_REGISTERED", "donor", donorId, JSON.stringify(input));
        return { success: true, donorId };
      }),

    getProfile: protectedProcedure.query(async ({ ctx }) => {
      return getDonorByUserId(ctx.user!.id);
    }),

    updateProfile: protectedProcedure
      .input(z.object({
        bloodType: z.enum(["O-", "O+", "A-", "A+", "B-", "B+", "AB-", "AB+"]).optional(),
        phone: z.string().optional(),
        address: z.string().optional(),
        medicalHistory: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");

        const donor = await getDonorByUserId(ctx.user!.id);
        if (!donor) throw new Error("Donor profile not found");

        await db.update(donors).set(input).where(eq(donors.userId, ctx.user!.id));
        await createAuditLog(ctx.user!.id, "DONOR_UPDATED", "donor", donor.id, JSON.stringify(input));
        
        return { success: true };
      }),
  }),

  // Inventory operations
  inventory: router({
    getAll: publicProcedure.query(async () => {
      const db = await getDb();
      if (!db) return [];
      return db.select().from(bloodInventory).orderBy(bloodInventory.bloodType);
    }),

    getByBloodType: publicProcedure
      .input(z.object({ bloodType: z.string() }))
      .query(async ({ input }) => {
        return getAvailableInventoryByBloodType(input.bloodType);
      }),

    addUnit: protectedProcedure
      .input(z.object({
        bloodType: z.enum(["O-", "O+", "A-", "A+", "B-", "B+", "AB-", "AB+"]),
        quantity: z.number().min(1),
        expirationDate: z.date(),
      }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user!.role !== "admin") throw new Error("Unauthorized");
        
        const db = await getDb();
        if (!db) throw new Error("Database not available");

        const result = await db.insert(bloodInventory).values({
          bloodType: input.bloodType,
          quantity: input.quantity,
          expirationDate: input.expirationDate,
          status: "available",
        });

        const inventoryId = (result as any).insertId || 0;
        await createAuditLog(ctx.user!.id, "INVENTORY_ADDED", "blood_inventory", inventoryId, JSON.stringify(input));
        return { success: true, inventoryId };
      }),

    updateStatus: protectedProcedure
      .input(z.object({
        inventoryId: z.number(),
        status: z.enum(["available", "reserved", "used", "expired"]),
      }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user!.role !== "admin") throw new Error("Unauthorized");
        
        const db = await getDb();
        if (!db) throw new Error("Database not available");

        await db.update(bloodInventory).set({ status: input.status }).where(eq(bloodInventory.id, input.inventoryId));
        await createAuditLog(ctx.user!.id, "INVENTORY_STATUS_UPDATED", "blood_inventory", input.inventoryId, JSON.stringify(input));
        
        return { success: true };
      }),

    getSummary: publicProcedure.query(async () => {
      const db = await getDb();
      if (!db) return {};

      const all = await db.select().from(bloodInventory);
      const summary: Record<string, number> = {};
      
      all.forEach(item => {
        if (!summary[item.bloodType]) summary[item.bloodType] = 0;
        if (item.status === "available") summary[item.bloodType] += item.quantity;
      });

      return summary;
    }),
  }),

  // Hospital request operations
  request: router({
    submit: protectedProcedure
      .input(z.object({
        hospitalName: z.string(),
        bloodType: z.enum(["O-", "O+", "A-", "A+", "B-", "B+", "AB-", "AB+"]),
        quantity: z.number().min(1),
        urgency: z.enum(["routine", "urgent", "emergency"]),
        patientName: z.string().optional(),
        reason: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user!.role !== "hospital_staff") throw new Error("Unauthorized");
        
        const db = await getDb();
        if (!db) throw new Error("Database not available");

        const result = await db.insert(hospitalRequests).values({
          hospitalName: input.hospitalName,
          requestedByUserId: ctx.user!.id,
          bloodType: input.bloodType,
          quantity: input.quantity,
          urgency: input.urgency,
          patientName: input.patientName,
          reason: input.reason,
          status: "pending",
        });

        const requestId = (result as any).insertId || 0;
        await createAuditLog(ctx.user!.id, "REQUEST_SUBMITTED", "hospital_request", requestId, JSON.stringify(input));
        
        // Trigger matching engine
        await matchBloodRequest(requestId);

        return { success: true, requestId };
      }),

    getAll: publicProcedure.query(async () => {
      const db = await getDb();
      if (!db) return [];
      return db.select().from(hospitalRequests).orderBy(hospitalRequests.requestDate);
    }),

    getByStatus: publicProcedure
      .input(z.object({ status: z.enum(["pending", "matched", "fulfilled", "cancelled"]) }))
      .query(async ({ input }) => {
        const db = await getDb();
        if (!db) return [];
        return db.select().from(hospitalRequests).where(eq(hospitalRequests.status, input.status));
      }),

    updateStatus: protectedProcedure
      .input(z.object({
        requestId: z.number(),
        status: z.enum(["pending", "matched", "fulfilled", "cancelled"]),
      }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user!.role !== "admin" && ctx.user!.role !== "hospital_staff") throw new Error("Unauthorized");
        
        const db = await getDb();
        if (!db) throw new Error("Database not available");

        const updateData: any = { status: input.status };
        if (input.status === "fulfilled") {
          updateData.fulfilledDate = new Date();
        }

        await db.update(hospitalRequests).set(updateData).where(eq(hospitalRequests.id, input.requestId));
        await createAuditLog(ctx.user!.id, "REQUEST_STATUS_UPDATED", "hospital_request", input.requestId, JSON.stringify(input));
        
        return { success: true };
      }),
  }),

  // Audit log operations
  audit: router({
    getAll: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user!.role !== "admin") throw new Error("Unauthorized");
      
      const db = await getDb();
      if (!db) return [];
      return db.select().from(auditLogs).orderBy(auditLogs.timestamp);
    }),

    getByUser: protectedProcedure
      .input(z.object({ userId: z.number() }))
      .query(async ({ ctx, input }) => {
        if (ctx.user!.role !== "admin") throw new Error("Unauthorized");
        
        const db = await getDb();
        if (!db) return [];
        return db.select().from(auditLogs).where(eq(auditLogs.userId, input.userId));
      }),
  }),

  // Notification operations
  notification: router({
    getForUser: protectedProcedure.query(async ({ ctx }) => {
      const db = await getDb();
      if (!db) return [];
      return db.select().from(notifications).where(eq(notifications.userId, ctx.user!.id));
    }),

    markAsRead: protectedProcedure
      .input(z.object({ notificationId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");

        await db.update(notifications).set({ isRead: true }).where(eq(notifications.id, input.notificationId));
        return { success: true };
      }),
  }),
});

// Blood type matching engine
async function matchBloodRequest(requestId: number) {
  const db = await getDb();
  if (!db) return;

  const request = await db.select().from(hospitalRequests).where(eq(hospitalRequests.id, requestId)).limit(1);
  if (!request.length) return;

  const req = request[0];
  const available = await getAvailableInventoryByBloodType(req.bloodType);

  if (available.length > 0) {
    const inventory = available[0];
    
    // Create match record
    await db.insert(bloodMatches).values({
      requestId: req.id,
      inventoryId: inventory.id,
      matchScore: "100.00",
    });

    // Update request status
    await db.update(hospitalRequests).set({ 
      status: "matched" as any,
      matchedInventoryId: inventory.id 
    }).where(eq(hospitalRequests.id, requestId));

    // Update inventory status
    await db.update(bloodInventory).set({ status: "reserved" }).where(eq(bloodInventory.id, inventory.id));

    // Create notification
    await createNotification(req.requestedByUserId, "match_found", "Blood Match Found", `Blood type ${req.bloodType} matched for your request`);
  }
}

export type AppRouter = typeof appRouter;
