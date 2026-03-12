import { Router, Request, Response } from 'express';
import { query } from '../config/database';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.use(authMiddleware);

/**
 * POST /checkins
 * Registra um check-in de exercício (paciente)
 */
router.post('/', async (req: Request, res: Response) => {
  try {
    const { paciente_id, prescricao_id, executado, nivel_dor, observacoes } = req.body;

    if (!paciente_id || !prescricao_id) {
      res.status(400).json({ error: 'paciente_id e prescricao_id são obrigatórios' });
      return;
    }

    const result = await query(`
      INSERT INTO checkins (paciente_id, prescricao_id, executado, nivel_dor, observacoes)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `, [paciente_id, prescricao_id, executado ?? false, nivel_dor, observacoes]);

    res.status(201).json(result.rows[0]);
  } catch (err: any) {
    // Violação de unique constraint (check-in duplicado no mesmo dia)
    if (err.code === '23505') {
      res.status(409).json({ error: 'Check-in já registrado hoje para este exercício' });
      return;
    }
    console.error('[CHECKINS CREATE]', err);
    res.status(500).json({ error: 'Erro ao registrar check-in' });
  }
});

/**
 * GET /checkins/paciente/:pacienteId
 * Lista check-ins de um paciente (filtro opcional por data)
 */
router.get('/paciente/:pacienteId', async (req: Request, res: Response) => {
  try {
    const { dataInicio, dataFim } = req.query;

    let sql = `
      SELECT 
        c.*,
        pr.series, pr.repeticoes, pr.frequencia,
        e.nome AS exercicio_nome,
        e.tipo AS exercicio_tipo
      FROM checkins c
      JOIN prescricoes pr ON pr.id = c.prescricao_id
      JOIN exercicios e ON e.id = pr.exercicio_id
      WHERE c.paciente_id = $1
    `;
    const params: unknown[] = [req.params.pacienteId];
    let paramIndex = 2;

    if (dataInicio) {
      sql += ` AND c.data >= $${paramIndex++}`;
      params.push(dataInicio);
    }

    if (dataFim) {
      sql += ` AND c.data <= $${paramIndex++}`;
      params.push(dataFim);
    }

    sql += ' ORDER BY c.data DESC, c.created_at DESC';

    const result = await query(sql, params);
    res.json(result.rows);
  } catch (err) {
    console.error('[CHECKINS LIST]', err);
    res.status(500).json({ error: 'Erro ao listar check-ins' });
  }
});

/**
 * GET /checkins/paciente/:pacienteId/evolucao
 * Dados de evolução (média de dor por semana, taxa de execução)
 */
router.get('/paciente/:pacienteId/evolucao', async (req: Request, res: Response) => {
  try {
    const result = await query(`
      SELECT 
        date_trunc('week', c.data) AS semana,
        ROUND(AVG(c.nivel_dor)::numeric, 1) AS media_dor,
        COUNT(*) FILTER (WHERE c.executado = TRUE) AS executados,
        COUNT(*) AS total,
        ROUND(
          (COUNT(*) FILTER (WHERE c.executado = TRUE)::numeric / NULLIF(COUNT(*), 0)) * 100, 1
        ) AS taxa_execucao
      FROM checkins c
      WHERE c.paciente_id = $1
      GROUP BY date_trunc('week', c.data)
      ORDER BY semana DESC
      LIMIT 12
    `, [req.params.pacienteId]);

    res.json(result.rows);
  } catch (err) {
    console.error('[CHECKINS EVOLUCAO]', err);
    res.status(500).json({ error: 'Erro ao buscar evolução' });
  }
});

export default router;
