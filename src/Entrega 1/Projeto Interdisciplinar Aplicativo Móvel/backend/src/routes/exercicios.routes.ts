import { Router, Request, Response } from 'express';
import { query } from '../config/database';
import { authMiddleware, requireRole } from '../middleware/auth';

const router = Router();

router.use(authMiddleware);

/**
 * GET /exercicios
 * Lista todos os exercícios ativos
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const { tipo, dificuldade, busca } = req.query;

    let sql = `
      SELECT e.*, u.nome AS criado_por_nome
      FROM exercicios e
      LEFT JOIN usuarios u ON u.id = e.criado_por
      WHERE e.ativo = TRUE
    `;
    const params: unknown[] = [];
    let paramIndex = 1;

    if (tipo) {
      sql += ` AND e.tipo = $${paramIndex++}`;
      params.push(tipo);
    }

    if (dificuldade) {
      sql += ` AND e.dificuldade = $${paramIndex++}`;
      params.push(dificuldade);
    }

    if (busca) {
      sql += ` AND (e.nome ILIKE $${paramIndex} OR e.descricao ILIKE $${paramIndex} OR $${paramIndex + 1} = ANY(e.tags))`;
      params.push(`%${busca}%`, busca);
      paramIndex += 2;
    }

    sql += ' ORDER BY e.nome ASC';

    const result = await query(sql, params);
    res.json(result.rows);
  } catch (err) {
    console.error('[EXERCICIOS LIST]', err);
    res.status(500).json({ error: 'Erro ao listar exercícios' });
  }
});

/**
 * GET /exercicios/:id
 */
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const result = await query(`
      SELECT e.*, u.nome AS criado_por_nome
      FROM exercicios e
      LEFT JOIN usuarios u ON u.id = e.criado_por
      WHERE e.id = $1
    `, [req.params.id]);

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Exercício não encontrado' });
      return;
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('[EXERCICIOS GET]', err);
    res.status(500).json({ error: 'Erro ao buscar exercício' });
  }
});

/**
 * POST /exercicios
 * Cria um novo exercício (admin / profissional)
 */
router.post('/', requireRole('admin', 'profissional'), async (req: Request, res: Response) => {
  try {
    const { nome, descricao, instrucoes, musculo_alvo, tipo, dificuldade, midia_url, tags } = req.body;

    if (!nome) {
      res.status(400).json({ error: 'Nome do exercício é obrigatório' });
      return;
    }

    const result = await query(`
      INSERT INTO exercicios (nome, descricao, instrucoes, musculo_alvo, tipo, dificuldade, midia_url, tags, criado_por)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `, [nome, descricao, instrucoes, musculo_alvo, tipo || 'outro', dificuldade || 'moderado', midia_url, tags || [], req.user!.userId]);

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('[EXERCICIOS CREATE]', err);
    res.status(500).json({ error: 'Erro ao criar exercício' });
  }
});

/**
 * PUT /exercicios/:id
 */
router.put('/:id', requireRole('admin', 'profissional'), async (req: Request, res: Response) => {
  try {
    const { nome, descricao, instrucoes, musculo_alvo, tipo, dificuldade, midia_url, tags } = req.body;

    const result = await query(`
      UPDATE exercicios SET
        nome = COALESCE($1, nome),
        descricao = COALESCE($2, descricao),
        instrucoes = COALESCE($3, instrucoes),
        musculo_alvo = COALESCE($4, musculo_alvo),
        tipo = COALESCE($5, tipo),
        dificuldade = COALESCE($6, dificuldade),
        midia_url = COALESCE($7, midia_url),
        tags = COALESCE($8, tags)
      WHERE id = $9
      RETURNING *
    `, [nome, descricao, instrucoes, musculo_alvo, tipo, dificuldade, midia_url, tags, req.params.id]);

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Exercício não encontrado' });
      return;
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('[EXERCICIOS UPDATE]', err);
    res.status(500).json({ error: 'Erro ao atualizar exercício' });
  }
});

/**
 * DELETE /exercicios/:id (soft delete)
 */
router.delete('/:id', requireRole('admin', 'profissional'), async (req: Request, res: Response) => {
  try {
    const result = await query(
      'UPDATE exercicios SET ativo = FALSE WHERE id = $1 RETURNING id',
      [req.params.id]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Exercício não encontrado' });
      return;
    }

    res.json({ message: 'Exercício desativado com sucesso' });
  } catch (err) {
    console.error('[EXERCICIOS DELETE]', err);
    res.status(500).json({ error: 'Erro ao remover exercício' });
  }
});

export default router;
