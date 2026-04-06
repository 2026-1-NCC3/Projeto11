// Servidor principal da API — ponto de entrada do backend.
// Configura o Express, registra as rotas e sobe o servidor na porta 8000.

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

// Carrega as variáveis de ambiente do arquivo .env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

// ── Middlewares globais ──────────────────────────────────────
app.use(helmet());               // cabeçalhos de segurança HTTP
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',  // permite requisições do frontend
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));  // parse do body JSON (limite pra uploads)

// ── Health check ─────────────────────────────────────────────
// Rota simples pra verificar se o servidor tá no ar (usada pelo Render)
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ── Rotas ────────────────────────────────────────────────────
// Cada módulo tem seu arquivo de rotas separado
app.use('/auth', authRoutes);             // login, logout, /me
app.use('/pacientes', pacientesRoutes);   // CRUD de pacientes
app.use('/exercicios', exerciciosRoutes); // CRUD do banco de exercícios
app.use('/prescricoes', prescricoesRoutes); // prescrições de exercícios
app.use('/checkins', checkinsRoutes);     // check-ins diários do paciente
app.use('/prontuario', prontuarioRoutes); // sessões de atendimento

// ── Tratamento de erros global ───────────────────────────────
// Se alguma rota lançar um erro não tratado, cai aqui
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('[ERROR]', err.message);
  res.status(500).json({ error: 'Erro interno do servidor' });
});

// ── Inicialização ────────────────────────────────────────────
// Testa a conexão com o banco e sobe o servidor
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

// Forçando redeploy no Render (trigger)
export default app;
