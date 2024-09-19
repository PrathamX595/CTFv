CREATE TABLE `challenges` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text NOT NULL,
	`url` text NOT NULL,
	`points` integer NOT NULL,
	`category` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `user` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`password` text NOT NULL,
	`rollNo` text,
	`instituteName` text,
	`emailVerified` integer,
	`image` text,
	`website` text,
	`affiliation` text,
	`country` text,
	`isAdmin` integer DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `user_email_unique` ON `user` (`email`);