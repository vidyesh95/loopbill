CREATE TABLE `app_setting` (
	`key` text PRIMARY KEY NOT NULL,
	`value` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `reschedule_request` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`service_id` integer,
	`customer_id` integer,
	`phone` text,
	`requested_date` text,
	`reason` text,
	`status` text DEFAULT 'pending' NOT NULL,
	`source` text NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`service_id`) REFERENCES `service`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`customer_id`) REFERENCES `customer`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE TABLE `service_proof` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`service_id` integer NOT NULL,
	`url` text NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`service_id`) REFERENCES `service`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `site_content` (
	`key` text PRIMARY KEY NOT NULL,
	`value` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `site_pricing` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`slug` text NOT NULL,
	`label` text NOT NULL,
	`residential_base` integer NOT NULL,
	`commercial_per_sqft` integer NOT NULL,
	`multipliers` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `site_pricing_slug_unique` ON `site_pricing` (`slug`);--> statement-breakpoint
CREATE TABLE `site_service` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`slug` text NOT NULL,
	`title` text NOT NULL,
	`category` text NOT NULL,
	`summary` text NOT NULL,
	`details` text NOT NULL,
	`sort` integer DEFAULT 0 NOT NULL,
	`published` integer DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `site_service_slug_unique` ON `site_service` (`slug`);--> statement-breakpoint
ALTER TABLE `complaint` ADD `raised_at` integer;--> statement-breakpoint
ALTER TABLE `complaint` ADD `visible_to_admin_at` integer;--> statement-breakpoint
ALTER TABLE `complaint` ADD `attended_at` integer;--> statement-breakpoint
ALTER TABLE `complaint` ADD `redo_service_id` integer;--> statement-breakpoint
ALTER TABLE `contract` ADD `salesperson_id` text REFERENCES user(id);--> statement-breakpoint
ALTER TABLE `contract` ADD `purchased_at` integer;--> statement-breakpoint
ALTER TABLE `contract` ADD `locked` integer DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `contract` ADD `reschedule_flags` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `customer` ADD `salesperson_id` text REFERENCES user(id);--> statement-breakpoint
ALTER TABLE `location` ADD `building` text;--> statement-breakpoint
ALTER TABLE `location` ADD `wing` text;--> statement-breakpoint
ALTER TABLE `location` ADD `flat_no` text;--> statement-breakpoint
ALTER TABLE `service` ADD `service_number` integer DEFAULT 1 NOT NULL;--> statement-breakpoint
ALTER TABLE `service` ADD `notes` text;--> statement-breakpoint
ALTER TABLE `service` ADD `completion_notes` text;--> statement-breakpoint
ALTER TABLE `service` ADD `completed_at` integer;--> statement-breakpoint
ALTER TABLE `service` ADD `reschedule_count` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `service` ADD `absence_reported_at` integer;--> statement-breakpoint
ALTER TABLE `service` ADD `redo_of_service_id` integer;