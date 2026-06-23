// =============================================================
// DATABASE CONNECTION
// =============================================================
// This file creates ONE shared connection to your PostgreSQL
// database. Every other file in the app imports `db` from here
// instead of creating their own connection.
//
// IMPORTANT: This file only runs on the SERVER, never in the
// browser, so your DATABASE_URL is never exposed to users.
// =============================================================

import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL is missing. Copy .env.example to .env.local and fill in your database connection string."
  );
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl:
    process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: false }
      : undefined,
});

export const db = drizzle(pool, { schema });
