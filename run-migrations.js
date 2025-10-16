/*
  Simple SQL migration runner for Supabase (Postgres) using service role.
  - Reads all .sql files in /sql sorted lexicographically
  - Keeps idempotency by relying on CREATE IF NOT EXISTS inside SQL
  Security: runs server-side only. Do NOT expose service role key to clients.
*/

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

async function main() {
  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE;
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE) {
    console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE');
    process.exit(1);
  }

  const sqlDir = path.join(process.cwd(), 'sql');
  if (!fs.existsSync(sqlDir)) {
    console.log('No sql directory; nothing to migrate.');
    return;
  }

  const files = fs
    .readdirSync(sqlDir)
    .filter((f) => f.endsWith('.sql'))
    .sort();

  if (files.length === 0) {
    console.log('No SQL files found; nothing to migrate.');
    return;
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { headers: { 'X-Client-Info': 'codegryphon-migrator' } },
  });

  // Supabase JS client doesn't execute arbitrary SQL; use PostgREST rpc via SQL function would be ideal.
  // For simplicity, use fetch directly to query PostgREST SQL endpoint is not available.
  // We'll split statements and run via postgres' anonymous DO block through http is not supported either.
  // Alternative: use pg driver, but we keep dependencies slim. We'll call Supabase SQL API via REST if available in env.

  // Use direct connection string if provided (optional enhancement)
  const DATABASE_URL = process.env.SUPABASE_DB_URL || process.env.DATABASE_URL;
  if (!DATABASE_URL) {
    console.warn('DATABASE_URL not provided; cannot run SQL directly. Please set SUPABASE_DB_URL to a Postgres connection string.');
    console.warn('Skipping migrations. You can run them manually in Supabase SQL Editor.');
    return;
  }

  // Lazy import pg to avoid adding to runtime deps; it's only used in CI/Build
  const { Client } = require('pg');
  const client = new Client({ connectionString: DATABASE_URL, ssl: { rejectUnauthorized: false } });
  await client.connect();

  try {
    for (const file of files) {
      const full = path.join(sqlDir, file);
      const sql = fs.readFileSync(full, 'utf8');
      console.log('Running migration:', file);
      await client.query(sql);
    }
    console.log('Migrations completed successfully.');
  } finally {
    await client.end();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
