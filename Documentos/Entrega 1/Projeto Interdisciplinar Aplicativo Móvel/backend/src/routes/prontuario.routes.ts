import { Router, Request, Response } from 'express';
import { query } from '../config/database';
import { authMiddleware, requireRole } from '../middleware/auth';

const router = Router();

router.use(authMiddleware);

/**
 * GET /prontuario/paciente/:pacienteId/sessoes
 * Lista sessões do prontuário de um paciente
 */
router.get('/paciente/:pacienteId/sessoes', async (req: Request, res: Response) => {
  try {
    const result = await query(`
      SELECT 
        s.*,
        u.nome AS profissional_nome
      FROM sessoes_prontuario s
      JOIN usuarios u ON u.id = s.profissional_id
      WHERE s.paciente_id = $1
      ORDER BY s.data_sessao DESC
    `, [req.params.pacienteId]);

    res.json(result.rows);
  } catch (err) {
    console.error('[PRONTUARIO LIST]', err);
    res.status(500).json({ error: 'Erro ao listar sessões do prontuário' });
  }
});

/**
 * POST /prontuario/paciente/:pacienteId/sessoes
 * Registra uma nova sessão no prontuário
 */
router.post('/paciente/:pacienteId/sessoes', requireRole('admin', 'profissional'), async (req: Request, res: Response) => {
  try {
    const { data_sessao, notas, evolucao, condutas, nivel_dor_inicio, nivel_dor_fim } = req.body;

    const result = await query(`
      INSERT INTO sessoes_prontuario (paciente_id, profissional_id, data_sessao, notas, evolucao, condutas, nivel_dor_inicio, nivel_dor_fim)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `, [
      req.params.pacienteId,
      req.user!.userId,
      data_sessao || new Date(),
      notas,
      evolucao,
      condutas,
      nivel_dor_inicio,
      nivel_dor_fim,
    ]);

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('[PRONTUARIO CREATE]', err);
    res.status(500).json({ error: 'Erro ao registrar sessão' });
  }
});

export default router;
