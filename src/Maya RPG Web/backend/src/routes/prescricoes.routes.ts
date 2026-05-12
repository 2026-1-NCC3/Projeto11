import { Router, Request, Response } from 'express';
import { query } from '../config/database';
import { authMiddleware, requireRole } from '../middleware/auth';

const router = Router();

router.use(authMiddleware);

/**
 * GET /pacientes/:pacienteId/prescricoes
 * Lista as prescrições de um paciente
 */
router.get('/paciente/:pacienteId', async (req: Request, res: Response) => {
  try {
    const result = await query(`
      SELECT 
        pr.*,
        e.nome AS exercicio_nome,
        e.descricao AS exercicio_descricao,
        e.instrucoes AS exercicio_instrucoes,
        e.musculo_alvo AS exercicio_musculo,
        e.tipo AS exercicio_tipo,
        e.dificuldade AS exercicio_dificuldade,
        e.midia_url AS exercicio_midia_url
      FROM prescricoes pr
      JOIN exercicios e ON e.id = pr.exercicio_id
      WHERE pr.paciente_id = $1 AND pr.ativo = TRUE
      ORDER BY pr.created_at DESC
    `, [req.params.pacienteId]);

    res.json(result.rows);
  } catch (err) {
    console.error('[PRESCRICOES LIST]', err);
    res.status(500).json({ error: 'Erro ao listar prescrições' });
  }
});

/**
 * POST /prescricoes
 * Cria uma nova prescrição
 */
router.post('/', requireRole('admin', 'profissional'), async (req: Request, res: Response) => {
  try {
    const { paciente_id, exercicio_id, series, repeticoes, duracao_seg, frequencia, observacoes } = req.body;

    if (!paciente_id || !exercicio_id) {
      res.status(400).json({ error: 'paciente_id e exercicio_id são obrigatórios' });
      return;
    }

    const result = await query(`
      INSERT INTO prescricoes (paciente_id, exercicio_id, series, repeticoes, duracao_seg, frequencia, observacoes, criado_por)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `, [paciente_id, exercicio_id, series || 3, repeticoes || 10, duracao_seg, frequencia, observacoes, req.user!.userId]);

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('[PRESCRICOES CREATE]', err);
    res.status(500).json({ error: 'Erro ao criar prescrição' });
  }
});

/**
 * PUT /prescricoes/:id
 */
router.put('/:id', requireRole('admin', 'profissional'), async (req: Request, res: Response) => {
  try {
    const { series, repeticoes, duracao_seg, frequencia, observacoes, ativo } = req.body;

    const result = await query(`
      UPDATE prescricoes SET
        series = COALESCE($1, series),
        repeticoes = COALESCE($2, repeticoes),
        duracao_seg = COALESCE($3, duracao_seg),
        frequencia = COALESCE($4, frequencia),
        observacoes = COALESCE($5, observacoes),
        ativo = COALESCE($6, ativo)
      WHERE id = $7
      RETURNING *
    `, [series, repeticoes, duracao_seg, frequencia, observacoes, ativo, req.params.id]);

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Prescrição não encontrada' });
      return;
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('[PRESCRICOES UPDATE]', err);
    res.status(500).json({ error: 'Erro ao atualizar prescrição' });
  }
});

/**
 * DELETE /prescricoes/:id
 */
router.delete('/:id', requireRole('admin', 'profissional'), async (req: Request, res: Response) => {
  try {
    const result = await query(
      'UPDATE prescricoes SET ativo = FALSE WHERE id = $1 RETURNING id',
      [req.params.id]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Prescrição não encontrada' });
      return;
    }

    res.json({ message: 'Prescrição desativada com sucesso' });
  } catch (err) {
    console.error('[PRESCRICOES DELETE]', err);
    res.status(500).json({ error: 'Erro ao remover prescrição' });
  }
});

export default router;
