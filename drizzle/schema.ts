import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, decimal, boolean } from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";

/**
 * Core user table backing auth flow.
 * Extended with role-based access control for blood bank system.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["donor", "hospital_staff", "admin"]).default("donor").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Donor profiles with medical history and blood type information
 */
export const donors = mysqlTable("donors", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  bloodType: mysqlEnum("bloodType", ["O-", "O+", "A-", "A+", "B-", "B+", "AB-", "AB+"]).notNull(),
  dateOfBirth: timestamp("dateOfBirth"),
  phone: varchar("phone", { length: 20 }),
  address: text("address"),
  medicalHistory: text("medicalHistory"),
  lastDonationDate: timestamp("lastDonationDate"),
  isEligible: boolean("isEligible").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Donor = typeof donors.$inferSelect;
export type InsertDonor = typeof donors.$inferInsert;

/**
 * Blood inventory tracking by blood type
 */
export const bloodInventory = mysqlTable("blood_inventory", {
  id: int("id").autoincrement().primaryKey(),
  bloodType: mysqlEnum("bloodType", ["O-", "O+", "A-", "A+", "B-", "B+", "AB-", "AB+"]).notNull(),
  quantity: int("quantity").default(0).notNull(),
  expirationDate: timestamp("expirationDate"),
  donorId: int("donorId"),
  collectionDate: timestamp("collectionDate").defaultNow().notNull(),
  status: mysqlEnum("status", ["available", "reserved", "used", "expired"]).default("available").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type BloodInventory = typeof bloodInventory.$inferSelect;
export type InsertBloodInventory = typeof bloodInventory.$inferInsert;

/**
 * Hospital blood requests
 */
export const hospitalRequests = mysqlTable("hospital_requests", {
  id: int("id").autoincrement().primaryKey(),
  hospitalName: varchar("hospitalName", { length: 255 }).notNull(),
  requestedByUserId: int("requestedByUserId").notNull(),
  bloodType: mysqlEnum("bloodType", ["O-", "O+", "A-", "A+", "B-", "B+", "AB-", "AB+"]).notNull(),
  quantity: int("quantity").default(1).notNull(),
  urgency: mysqlEnum("urgency", ["routine", "urgent", "emergency"]).default("routine").notNull(),
  patientName: varchar("patientName", { length: 255 }),
  reason: text("reason"),
  status: mysqlEnum("status", ["pending", "matched", "fulfilled", "cancelled"]).default("pending").notNull(),
  matchedInventoryId: int("matchedInventoryId"),
  requestDate: timestamp("requestDate").defaultNow().notNull(),
  fulfilledDate: timestamp("fulfilledDate"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type HospitalRequest = typeof hospitalRequests.$inferSelect;
export type InsertHospitalRequest = typeof hospitalRequests.$inferInsert;

/**
 * Blood type matching records
 */
export const bloodMatches = mysqlTable("blood_matches", {
  id: int("id").autoincrement().primaryKey(),
  requestId: int("requestId").notNull(),
  inventoryId: int("inventoryId").notNull(),
  matchedAt: timestamp("matchedAt").defaultNow().notNull(),
  matchScore: decimal("matchScore", { precision: 5, scale: 2 }).default("100.00"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type BloodMatch = typeof bloodMatches.$inferSelect;
export type InsertBloodMatch = typeof bloodMatches.$inferInsert;

/**
 * Audit log for all system actions
 */
export const auditLogs = mysqlTable("audit_logs", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  action: varchar("action", { length: 100 }).notNull(),
  entityType: varchar("entityType", { length: 50 }).notNull(),
  entityId: int("entityId"),
  changes: text("changes"),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
  ipAddress: varchar("ipAddress", { length: 45 }),
});

export type AuditLog = typeof auditLogs.$inferSelect;
export type InsertAuditLog = typeof auditLogs.$inferInsert;

/**
 * Real-time notifications
 */
export const notifications = mysqlTable("notifications", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  type: mysqlEnum("type", ["emergency_request", "inventory_alert", "match_found", "request_fulfilled"]).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  message: text("message"),
  relatedEntityId: int("relatedEntityId"),
  isRead: boolean("isRead").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = typeof notifications.$inferInsert;