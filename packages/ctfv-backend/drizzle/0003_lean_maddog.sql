CREATE TABLE `challenges` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text NOT NULL,
	`url` text NOT NULL,
	`points` integer NOT NULL,
	`category` text NOT NULL
);
