import Database from "better-sqlite3";
import { mkdirSync } from "node:fs";
import { dirname } from "node:path";
import { env } from "../config/env";

let db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (db) return db;
  const dir = dirname(env.DATABASE_PATH);
  mkdirSync(dir, { recursive: true });
  db = new Database(env.DATABASE_PATH);
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");
  return db;
}

export function closeDb(): void {
  if (!db) return;
  db.close();
  db = null;
}
