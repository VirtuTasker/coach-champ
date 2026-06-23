CREATE TYPE "public"."mission_type" AS ENUM('confidence', 'memory', 'vocabulary', 'story', 'speaking', 'creativity', 'emotion', 'debate');
CREATE TYPE "public"."plan_tier" AS ENUM('free', 'monthly', 'premium', 'family', 'annual');
CREATE TYPE "public"."subscription_status" AS ENUM('active', 'trialing', 'past_due', 'cancelled', 'expired');
CREATE TABLE "achievements" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"child_id" uuid NOT NULL,
	"badge_key" text NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"earned_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE "children" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"parent_id" uuid NOT NULL,
	"name" text NOT NULL,
	"age" integer NOT NULL,
	"school" text,
	"grade" text,
	"favorite_subjects" jsonb DEFAULT '[]'::jsonb,
	"favorite_games" jsonb DEFAULT '[]'::jsonb,
	"interests" jsonb DEFAULT '[]'::jsonb,
	"goals" text,
	"strengths" jsonb DEFAULT '[]'::jsonb,
	"weaknesses" jsonb DEFAULT '[]'::jsonb,
	"level" integer DEFAULT 1 NOT NULL,
	"xp" integer DEFAULT 0 NOT NULL,
	"coins" integer DEFAULT 0 NOT NULL,
	"stars" integer DEFAULT 0 NOT NULL,
	"current_streak" integer DEFAULT 0 NOT NULL,
	"longest_streak" integer DEFAULT 0 NOT NULL,
	"last_active_date" timestamp,
	"confidence_score" integer DEFAULT 50 NOT NULL,
	"communication_score" integer DEFAULT 50 NOT NULL,
	"vocabulary_score" integer DEFAULT 50 NOT NULL,
	"memory_score" integer DEFAULT 50 NOT NULL,
	"creativity_score" integer DEFAULT 50 NOT NULL,
	"leadership_score" integer DEFAULT 50 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE "conversations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"child_id" uuid NOT NULL,
	"role" text NOT NULL,
	"content" text NOT NULL,
	"used_voice" boolean DEFAULT false NOT NULL,
	"module_type" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE "daily_missions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"child_id" uuid NOT NULL,
	"mission_type" "mission_type" NOT NULL,
	"title" text NOT NULL,
	"completed" boolean DEFAULT false NOT NULL,
	"xp_reward" integer DEFAULT 10 NOT NULL,
	"assigned_date" timestamp DEFAULT now() NOT NULL,
	"completed_at" timestamp
);

CREATE TABLE "parents" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"clerk_user_id" text NOT NULL,
	"email" text NOT NULL,
	"full_name" text,
	"phone" text,
	"consent_given_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "parents_clerk_user_id_unique" UNIQUE("clerk_user_id")
);

CREATE TABLE "reports" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"child_id" uuid NOT NULL,
	"period_type" text NOT NULL,
	"period_start" timestamp NOT NULL,
	"period_end" timestamp NOT NULL,
	"strengths" jsonb DEFAULT '[]'::jsonb,
	"improvement_areas" jsonb DEFAULT '[]'::jsonb,
	"summary" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE "subscriptions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"parent_id" uuid NOT NULL,
	"plan_tier" "plan_tier" DEFAULT 'free' NOT NULL,
	"status" "subscription_status" DEFAULT 'trialing' NOT NULL,
	"razorpay_subscription_id" text,
	"razorpay_customer_id" text,
	"current_period_end" timestamp,
	"daily_voice_minutes_used" integer DEFAULT 0 NOT NULL,
	"daily_voice_minutes_reset_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);

ALTER TABLE "achievements" ADD CONSTRAINT "achievements_child_id_children_id_fk" FOREIGN KEY ("child_id") REFERENCES "public"."children"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "children" ADD CONSTRAINT "children_parent_id_parents_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."parents"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "conversations" ADD CONSTRAINT "conversations_child_id_children_id_fk" FOREIGN KEY ("child_id") REFERENCES "public"."children"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "daily_missions" ADD CONSTRAINT "daily_missions_child_id_children_id_fk" FOREIGN KEY ("child_id") REFERENCES "public"."children"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "reports" ADD CONSTRAINT "reports_child_id_children_id_fk" FOREIGN KEY ("child_id") REFERENCES "public"."children"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_parent_id_parents_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."parents"("id") ON DELETE cascade ON UPDATE no action;