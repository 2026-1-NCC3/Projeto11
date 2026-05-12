// Configuração da conexão com o banco de dados PostgreSQL.
// Usa um Pool de conexões pra não ficar abrindo e fechando conexão a cada query.

import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

// URL de conexão vem do .env. Se não tiver, usa o padrão local.
const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/maya_rpg';

// Detecta se tá rodando em algum serviço na nuvem (Neon, Supabase) pra ativar SSL
const isCloud = connectionString.includes('neon.tech') || connectionString.includes('supabase');

// Pool de conexões — reutiliza conexões pra melhor performance
export const pool = new Pool({
  connectionString,
  ssl: isCloud ? { rejectUnauthorized: false } : undefined,  // SSL só na nuvem
  max: 20,                    // máximo de conexões simultâneas
  idleTimeoutMillis: 30_000,  // fecha conexão ociosa depois de 30s
  connectionTimeoutMillis: 30_000,  // timeout pra abrir conexão nova
});

// Log de erros inesperados no pool (perda de conexão, etc)
pool.on('error', (err) => {
  console.error('❌ Erro inesperado no pool PostgreSQL:', err);
});

// Testa se o banco tá acessível antes de subir o servidor
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

// Wrapper pra executar queries com log de queries lentas
export async function query(text: string, params?: unknown[]) {
  const start = Date.now();
  const result = await pool.query(text, params);
  const duration = Date.now() - start;
  // Loga um aviso se a query demorar mais de 1 segundo
  if (duration > 1000) {
    console.warn(`⚠️ Query lenta (${duration}ms):`, text.substring(0, 100));
  }
  return result;
}
