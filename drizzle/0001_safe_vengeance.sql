CREATE TABLE `audit_logs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`action` varchar(100) NOT NULL,
	`entityType` varchar(50) NOT NULL,
	`entityId` int,
	`changes` text,
	`timestamp` timestamp NOT NULL DEFAULT (now()),
	`ipAddress` varchar(45),
	CONSTRAINT `audit_logs_id` PRIMARY KEY(`id`)
);
CREATE TABLE `blood_inventory` (
	`id` int AUTO_INCREMENT NOT NULL,
	`bloodType` enum('O-','O+','A-','A+','B-','B+','AB-','AB+') NOT NULL,
	`quantity` int NOT NULL DEFAULT 0,
	`expirationDate` timestamp,
	`donorId` int,
	`collectionDate` timestamp NOT NULL DEFAULT (now()),
	`status` enum('available','reserved','used','expired') NOT NULL DEFAULT 'available',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `blood_inventory_id` PRIMARY KEY(`id`)
);
CREATE TABLE `blood_matches` (
	`id` int AUTO_INCREMENT NOT NULL,
	`requestId` int NOT NULL,
	`inventoryId` int NOT NULL,
	`matchedAt` timestamp NOT NULL DEFAULT (now()),
	`matchScore` decimal(5,2) DEFAULT '100.00',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `blood_matches_id` PRIMARY KEY(`id`)
);
CREATE TABLE `donors` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`bloodType` enum('O-','O+','A-','A+','B-','B+','AB-','AB+') NOT NULL,
	`dateOfBirth` timestamp,
	`phone` varchar(20),
	`address` text,
	`medicalHistory` text,
	`lastDonationDate` timestamp,
	`isEligible` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `donors_id` PRIMARY KEY(`id`)
);
CREATE TABLE `hospital_requests` (
	`id` int AUTO_INCREMENT NOT NULL,
	`hospitalName` varchar(255) NOT NULL,
	`requestedByUserId` int NOT NULL,
	`bloodType` enum('O-','O+','A-','A+','B-','B+','AB-','AB+') NOT NULL,
	`quantity` int NOT NULL DEFAULT 1,
	`urgency` enum('routine','urgent','emergency') NOT NULL DEFAULT 'routine',
	`patientName` varchar(255),
	`reason` text,
	`status` enum('pending','matched','fulfilled','cancelled') NOT NULL DEFAULT 'pending',
	`matchedInventoryId` int,
	`requestDate` timestamp NOT NULL DEFAULT (now()),
	`fulfilledDate` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `hospital_requests_id` PRIMARY KEY(`id`)
);
CREATE TABLE `notifications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`type` enum('emergency_request','inventory_alert','match_found','request_fulfilled') NOT NULL,
	`title` varchar(255) NOT NULL,
	`message` text,
	`relatedEntityId` int,
	`isRead` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `notifications_id` PRIMARY KEY(`id`)
);
ALTER TABLE `users` MODIFY COLUMN `role` enum('donor','hospital_staff','admin') NOT NULL DEFAULT 'donor';