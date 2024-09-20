import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  username: text("name").notNull(),
  email: text("email").unique().notNull(),
  password: text("password").notNull(),
  rollNo: text("rollNo"),
  instituteName: text("instituteName"),
  emailVerified: integer("emailVerified", { mode: "timestamp_ms" }),
  image: text("image"),
  website: text("website"),
  affiliation: text("affiliation"),
  country: text("country"),
  isAdmin: integer("isAdmin", { mode: "boolean" }).notNull().default(false),
});

export const challenges = sqliteTable("challenges", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  description: text("description").notNull(),
  url: text("url").notNull(),
  points: integer("points").notNull(),
  category: text("category", {
    enum: ["reversing", "osint", "pwn", "web", "forensics", "crypto", "stego"],
  }).notNull(),
  author: text("author").notNull()
});

// Keep other tables (accounts, sessions, verificationTokens, authenticators) as they were
