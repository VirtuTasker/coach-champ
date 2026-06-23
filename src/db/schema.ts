// =============================================================
// DATABASE SCHEMA
// =============================================================
// This file defines every table in the Coach Champ database.
// Think of each "pgTable" below as one spreadsheet, and each
// field inside it as one column in that spreadsheet.
// =============================================================

import {
  pgTable,
  text,
  timestamp,
  integer,
  boolean,
  jsonb,
  uuid,
  pgEnum,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ---- ENUMS (fixed sets of allowed values) ----

export const planTierEnum = pgEnum("plan_tier", [
  "free",
  "monthly",
  "premium",
  "family",
  "annual",
]);

export const subscriptionStatusEnum = pgEnum("subscription_status", [
  "active",
  "trialing",
  "past_due",
  "cancelled",
  "expired",
]);

export const missionTypeEnum = pgEnum("mission_type", [
  "confidence",
  "memory",
  "vocabulary",
  "story",
  "speaking",
  "creativity",
  "emotion",
  "debate",
]);

// ---- PARENTS (the account holder - Clerk handles their login) ----

export const parents = pgTable("parents", {
  id: uuid("id").primaryKey().defaultRandom(),
  clerkUserId: text("clerk_user_id").notNull().unique(),
  email: text("email").notNull(),
  fullName: text("full_name"),
  phone: text("phone"),
  consentGivenAt: timestamp("consent_given_at"), // legal: parent consent timestamp
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ---- CHILDREN (each parent can have multiple child profiles) ----

export const children = pgTable("children", {
  id: uuid("id").primaryKey().defaultRandom(),
  parentId: uuid("parent_id")
    .references(() => parents.id, { onDelete: "cascade" })
    .notNull(),
  name: text("name").notNull(),
  age: integer("age").notNull(),
  school: text("school"),
  grade: text("grade"),
  favoriteSubjects: jsonb("favorite_subjects").$type<string[]>().default([]),
  favoriteGames: jsonb("favorite_games").$type<string[]>().default([]),
  interests: jsonb("interests").$type<string[]>().default([]),
  goals: text("goals"),
  strengths: jsonb("strengths").$type<string[]>().default([]),
  weaknesses: jsonb("weaknesses").$type<string[]>().default([]),

  // Game world progress
  level: integer("level").default(1).notNull(),
  xp: integer("xp").default(0).notNull(),
  coins: integer("coins").default(0).notNull(),
  stars: integer("stars").default(0).notNull(),
  currentStreak: integer("current_streak").default(0).notNull(),
  longestStreak: integer("longest_streak").default(0).notNull(),
  lastActiveDate: timestamp("last_active_date"),

  // Live scores shown on parent dashboard (0-100 each)
  confidenceScore: integer("confidence_score").default(50).notNull(),
  communicationScore: integer("communication_score").default(50).notNull(),
  vocabularyScore: integer("vocabulary_score").default(50).notNull(),
  memoryScore: integer("memory_score").default(50).notNull(),
  creativityScore: integer("creativity_score").default(50).notNull(),
  leadershipScore: integer("leadership_score").default(50).notNull(),

  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ---- SUBSCRIPTIONS (linked to a parent, controls access) ----

export const subscriptions = pgTable("subscriptions", {
  id: uuid("id").primaryKey().defaultRandom(),
  parentId: uuid("parent_id")
    .references(() => parents.id, { onDelete: "cascade" })
    .notNull(),
  planTier: planTierEnum("plan_tier").default("free").notNull(),
  status: subscriptionStatusEnum("status").default("trialing").notNull(),
  razorpaySubscriptionId: text("razorpay_subscription_id"),
  razorpayCustomerId: text("razorpay_customer_id"),
  currentPeriodEnd: timestamp("current_period_end"),
  dailyVoiceMinutesUsed: integer("daily_voice_minutes_used").default(0).notNull(),
  dailyVoiceMinutesResetAt: timestamp("daily_voice_minutes_reset_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ---- CONVERSATIONS (chat history with Coach Champ, used for memory) ----

export const conversations = pgTable("conversations", {
  id: uuid("id").primaryKey().defaultRandom(),
  childId: uuid("child_id")
    .references(() => children.id, { onDelete: "cascade" })
    .notNull(),
  role: text("role").notNull(), // "child" | "coach"
  content: text("content").notNull(),
  usedVoice: boolean("used_voice").default(false).notNull(),
  moduleType: text("module_type"), // e.g. "speaking_coach", "story_generator"
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ---- DAILY MISSIONS (gamified daily tasks) ----

export const dailyMissions = pgTable("daily_missions", {
  id: uuid("id").primaryKey().defaultRandom(),
  childId: uuid("child_id")
    .references(() => children.id, { onDelete: "cascade" })
    .notNull(),
  missionType: missionTypeEnum("mission_type").notNull(),
  title: text("title").notNull(),
  completed: boolean("completed").default(false).notNull(),
  xpReward: integer("xp_reward").default(10).notNull(),
  assignedDate: timestamp("assigned_date").defaultNow().notNull(),
  completedAt: timestamp("completed_at"),
});

// ---- ACHIEVEMENTS / BADGES ----

export const achievements = pgTable("achievements", {
  id: uuid("id").primaryKey().defaultRandom(),
  childId: uuid("child_id")
    .references(() => children.id, { onDelete: "cascade" })
    .notNull(),
  badgeKey: text("badge_key").notNull(), // e.g. "first_story", "7_day_streak"
  title: text("title").notNull(),
  description: text("description"),
  earnedAt: timestamp("earned_at").defaultNow().notNull(),
});

// ---- WEEKLY/MONTHLY AI REPORTS (for parent dashboard) ----

export const reports = pgTable("reports", {
  id: uuid("id").primaryKey().defaultRandom(),
  childId: uuid("child_id")
    .references(() => children.id, { onDelete: "cascade" })
    .notNull(),
  periodType: text("period_type").notNull(), // "weekly" | "monthly"
  periodStart: timestamp("period_start").notNull(),
  periodEnd: timestamp("period_end").notNull(),
  strengths: jsonb("strengths").$type<string[]>().default([]),
  improvementAreas: jsonb("improvement_areas").$type<string[]>().default([]),
  summary: text("summary"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ---- RELATIONS (how tables connect to each other) ----

export const parentsRelations = relations(parents, ({ many }) => ({
  children: many(children),
  subscriptions: many(subscriptions),
}));

export const childrenRelations = relations(children, ({ one, many }) => ({
  parent: one(parents, { fields: [children.parentId], references: [parents.id] }),
  conversations: many(conversations),
  dailyMissions: many(dailyMissions),
  achievements: many(achievements),
  reports: many(reports),
}));
