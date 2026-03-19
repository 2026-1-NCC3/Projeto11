import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/maya_rpg';
const isCloud = connectionString.includes('neon.tech') || connectionString.includes('supabase');

export const pool = new Pool({
  connectionString,
  ssl: isCloud ? { rejectUnauthorized: false } : undefined,
  max: 20,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 30_000,
});

pool.on('error', (err) => {
  console.error('❌ Erro inesperado no pool PostgreSQL:', err);
});

export async function testConnection(): Promise<void> {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW()');
    console.log('🟢 PostgreSQL conectado:', result.rows[0].now);
    client.release();
  } catch (err) {
    console.error('❌ Falha ao conectar ao PostgreSQL:', err);
    throw err;
  }
}

export async function query(text: string, params?: unknown[]) {
  const start = Date.now();
  const result = await pool.query(text, params);
  const duration = Date.now() - start;
  if (duration > 1000) {
    console.warn(`⚠️ Query lenta (${duration}ms):`, text.substring(0, 100));
  }
  return result;
}
