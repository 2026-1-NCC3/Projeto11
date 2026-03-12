import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';

import { pool, testConnection } from './config/database';
import authRoutes from './routes/auth.routes';
import pacientesRoutes from './routes/pacientes.routes';
import exerciciosRoutes from './routes/exercicios.routes';
import prescricoesRoutes from './routes/prescricoes.routes';
import checkinsRoutes from './routes/checkins.routes';
import prontuarioRoutes from './routes/prontuario.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

// ── Middlewares globais ──────────────────────────────────────
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));

// ── Health check ─────────────────────────────────────────────
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ── Rotas ────────────────────────────────────────────────────
app.use('/auth', authRoutes);
app.use('/pacientes', pacientesRoutes);
app.use('/exercicios', exerciciosRoutes);
app.use('/prescricoes', prescricoesRoutes);
app.use('/checkins', checkinsRoutes);
app.use('/prontuario', prontuarioRoutes);

// ── Tratamento de erros global ───────────────────────────────
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('[ERROR]', err.message);
  res.status(500).json({ error: 'Erro interno do servidor' });
});

// ── Inicialização ────────────────────────────────────────────
async function start() {
  await testConnection();
  app.listen(PORT, () => {
    console.log(`🟢 Maya RPG API rodando em http://localhost:${PORT}`);
  });
}

start().catch((err) => {
  console.error('❌ Falha ao iniciar o servidor:', err);
  process.exit(1);
});

export default app;
