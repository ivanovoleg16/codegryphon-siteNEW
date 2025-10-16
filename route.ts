import { NextResponse } from 'next/server';
import { Client } from 'pg';

export async function GET() {
  try {
    const DATABASE_URL = process.env.SUPABASE_DB_URL || process.env.DATABASE_URL;
    if (!DATABASE_URL) {
      return NextResponse.json({ ok: false, error: 'No DATABASE_URL' }, { status: 500 });
    }
    const client = new Client({ connectionString: DATABASE_URL, ssl: { rejectUnauthorized: false } });
    await client.connect();

    // Check DB version and waitlist table existence
    const versionRes = await client.query('select version()');

    const tblRes = await client.query(
      `select exists (
        select 1 from information_schema.tables
        where table_schema = 'public' and table_name = 'waitlist'
      ) as exists`
    );

    const hasWaitlist = Boolean(tblRes?.rows?.[0]?.exists);

    await client.end();

    return NextResponse.json({ ok: true, db: versionRes.rows?.[0]?.version ?? 'unknown', hasWaitlist });
  } catch (e) {
    console.error('MIGRATION_STATUS_ERROR', e);
    return NextResponse.json({ ok: false, error: 'Check failed' }, { status: 500 });
  }
}
