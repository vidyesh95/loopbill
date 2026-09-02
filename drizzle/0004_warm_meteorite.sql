CREATE TABLE `invoice` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`contract_id` integer,
	`customer_id` integer NOT NULL,
	`number` text NOT NULL,
	`amount` integer NOT NULL,
	`status` text NOT NULL,
	`issued_at` integer,
	`due_at` integer,
	`paid_at` integer,
	`notes` text,
	FOREIGN KEY (`contract_id`) REFERENCES `contract`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`customer_id`) REFERENCES `customer`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `invoice_number_unique` ON `invoice` (`number`);--> statement-breakpoint
ALTER TABLE `customer` ADD `user_id` text REFERENCES user(id);--> statement-breakpoint
ALTER TABLE `location` ADD `lat` text;--> statement-breakpoint
ALTER TABLE `location` ADD `lng` text;--> statement-breakpoint
ALTER TABLE `notification` ADD `message` text;