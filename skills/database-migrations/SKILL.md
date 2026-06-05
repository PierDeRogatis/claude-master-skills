---
name: database-migrations
label: Database Migrations
description: |
  Safe schema change patterns for production databases: adding columns, renaming,
  removing, index operations, and type changes — all without downtime or data loss.
  TRIGGER when: creating or modifying database migration files, adding/renaming/
  removing columns or tables, adding indexes, changing column types, or when a
  user asks "how do I safely rename this column". SKIP: read-only queries,
  application code with no schema changes, seed data scripts.
version: "1.0.0"
author: PierDeRogatis
tags: [database, migrations, sql, postgres, schema, zero-downtime]
---

# Database Migrations

## Overview

Schema changes on live production databases require careful ordering to avoid downtime, data loss, and lock conflicts. The core principle: **expand then contract** — never make a breaking change in a single step. All patterns below assume PostgreSQL; adapt locking semantics for MySQL/SQLite.

## Behavior

### Before every migration

1. Test the migration on a staging database with production-scale data.
2. Verify rollback: can `down` be applied without data loss?
3. Check for lock conflicts: does the migration acquire `ACCESS EXCLUSIVE` lock? If yes, it blocks all reads/writes for its duration.
4. One migration file = one logical change. Never combine unrelated changes.

---

### Pattern 1 — Add a column

**Never** add a `NOT NULL` column without a default in a single step on a large table (rewrites the entire table).

```sql
-- Step 1: Add nullable (fast, no table rewrite)
ALTER TABLE users ADD COLUMN display_name TEXT;

-- Step 2: Backfill in batches (separate migration or background job)
UPDATE users SET display_name = name WHERE display_name IS NULL;

-- Step 3: Add constraint (separate migration, after backfill is complete)
ALTER TABLE users ALTER COLUMN display_name SET NOT NULL;
```

---

### Pattern 2 — Rename a column (zero-downtime)

Never `ALTER TABLE RENAME COLUMN` on a live table — it breaks existing queries immediately.

```sql
-- Step 1: Add new column
ALTER TABLE users ADD COLUMN full_name TEXT;

-- Step 2: Dual-write in application code (write to both columns)
-- Deploy application change first.

-- Step 3: Backfill new column
UPDATE users SET full_name = name WHERE full_name IS NULL;

-- Step 4: Migrate reads to new column in application code
-- Deploy application change.

-- Step 5: Drop old column (separate migration, after deploy confirmed)
ALTER TABLE users DROP COLUMN name;
```

---

### Pattern 3 — Remove a column

```
1. Remove all reads and writes from application code → deploy.
2. Confirm no queries reference the column (check ORM queries, raw SQL, views).
3. Drop the column in a migration:
   ALTER TABLE users DROP COLUMN IF EXISTS old_column;
```

Use `IF EXISTS` to make the migration idempotent.

---

### Pattern 4 — Add an index

Always use `CONCURRENTLY` — regular `CREATE INDEX` acquires a table lock that blocks writes.

```sql
-- Right: non-blocking
CREATE INDEX CONCURRENTLY idx_users_email ON users(email);

-- Wrong: blocks all writes until index build completes
CREATE INDEX idx_users_email ON users(email);
```

`CONCURRENTLY` cannot run inside a transaction block — run it as a standalone statement.

---

### Pattern 5 — Remove an index

```sql
DROP INDEX CONCURRENTLY IF EXISTS idx_users_email;
```

---

### Pattern 6 — Change a column type

Never `ALTER COLUMN TYPE` directly on a large table (full table rewrite + lock).

```sql
-- Step 1: Add new column with new type
ALTER TABLE orders ADD COLUMN total_cents BIGINT;

-- Step 2: Backfill
UPDATE orders SET total_cents = ROUND(total_amount * 100)::BIGINT;

-- Step 3: Dual-write in application code → deploy.

-- Step 4: Migrate reads → deploy.

-- Step 5: Drop old column
ALTER TABLE orders DROP COLUMN total_amount;
```

---

### Pattern 7 — Add a foreign key

Foreign key validation scans the entire table. Use `NOT VALID` then `VALIDATE` separately:

```sql
-- Step 1: Add constraint without validation (fast)
ALTER TABLE posts
  ADD CONSTRAINT fk_posts_user
  FOREIGN KEY (user_id) REFERENCES users(id)
  NOT VALID;

-- Step 2: Validate in a separate migration (takes a ShareUpdateExclusiveLock — allows reads/writes)
ALTER TABLE posts VALIDATE CONSTRAINT fk_posts_user;
```

## Rules

- MUST use `CREATE INDEX CONCURRENTLY` for all new indexes on production tables.
- MUST use `DROP INDEX CONCURRENTLY` when removing indexes.
- MUST NOT add a `NOT NULL` column without a default in a single migration on a table with existing rows.
- MUST NOT rename a column with a single `ALTER TABLE RENAME` on a live table — use the expand-contract pattern.
- MUST NOT combine schema changes with large data migrations in the same transaction.
- MUST make all migrations idempotent: use `IF NOT EXISTS` / `IF EXISTS` / `ADD COLUMN IF NOT EXISTS`.
- MUST test the `down` migration before deploying `up`.
- MUST deploy application code changes (dual-write, read migration) before and after each schema step.
- MUST run `CREATE INDEX CONCURRENTLY` outside of a transaction block.

## Examples

**Adding a `verified_at` timestamp to users:**

```sql
-- Migration: 20260605120000_add_users_verified_at.sql

-- Safe: nullable, no default required, no table rewrite
ALTER TABLE users ADD COLUMN IF NOT EXISTS verified_at TIMESTAMPTZ;

-- Index for querying unverified users (non-blocking)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_verified_at
  ON users(verified_at)
  WHERE verified_at IS NULL;
```

**Rollback:**
```sql
DROP INDEX CONCURRENTLY IF EXISTS idx_users_verified_at;
ALTER TABLE users DROP COLUMN IF EXISTS verified_at;
```

## Notes

- Supabase projects: run migrations via `supabase migration new` + `supabase db push`. Never alter schema directly in the dashboard on a production project.
- Prisma: use `prisma migrate dev` for dev; `prisma migrate deploy` for production. The expand-contract patterns apply to the raw SQL in `migrations/` files.
- The `CONCURRENTLY` option is PostgreSQL-specific. MySQL uses online DDL (`ALGORITHM=INPLACE, LOCK=NONE`) which has different semantics.
- Related skills: `planning` (design the migration strategy before writing SQL), `verification` (confirm migration applied correctly in staging before production), `security-review` (check for PII exposure during data migrations).
