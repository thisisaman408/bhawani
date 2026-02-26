// src/lib/db.ts
import { Pool } from 'pg';

const globalForDb = global as unknown as { pool: Pool | undefined };

export const pool = globalForDb.pool || new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? {
    rejectUnauthorized: false
  } : undefined,
  max: process.env.NODE_ENV === 'production' ? 5 : 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

if (process.env.NODE_ENV !== 'production') globalForDb.pool = pool;
