import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { query } from '../config/database';
import { authMiddleware, requireRole } from '../middleware/auth';

const router = Router();

// Todas as rotas de pacientes exigem autenticação
router.use(authMiddleware);

/**
 * GET /pacientes
 * Lista todos os pacientes (admin / profissional)
 */
router.get('/', requireRole('admin', 'profissional'), async (_req: Request, res: Response) => {
  try {
    const result = await query(`
      SELECT 
        p.id, p.usuario_id, p.queixa_principal, p.historico_medico,
        p.medicamentos, p.objetivos, p.observacoes, p.created_at, p.updated_at,
        u.nome, u.email, u.telefone, u.cpf, u.data_nascimento, u.avatar_url, u.ativo,
        prof.nome AS profissional_nome
      FROM pacientes p
      JOIN usuarios u ON u.id = p.usuario_id
      LEFT JOIN usuarios prof ON prof.id = p.profissional_id
      ORDER BY u.nome ASC
    `);

    res.json(result.rows);
  } catch (err) {
    console.error('[PACIENTES LIST]', err);
    res.status(500).json({ error: 'Erro ao listar pacientes' });
  }
});

/**
 * GET /pacientes/:id
 * Detalhes de um paciente
 */
router.get('/:id', requireRole('admin', 'profissional'), async (req: Request, res: Response) => {
  try {
    const result = await query(`
      SELECT 
        p.*, u.nome, u.email, u.telefone, u.cpf, u.data_nascimento, u.avatar_url, u.ativo,
        prof.nome AS profissional_nome
      FROM pacientes p
      JOIN usuarios u ON u.id = p.usuario_id
      LEFT JOIN usuarios prof ON prof.id = p.profissional_id
      WHERE p.id = $1
    `, [req.params.id]);

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Paciente não encontrado' });
      return;
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('[PACIENTES GET]', err);
    res.status(500).json({ error: 'Erro ao buscar paciente' });
  }
});

/**
 * POST /pacientes
 * Cria um novo paciente (cria usuario + paciente)
 */
router.post('/', requireRole('admin', 'profissional'), async (req: Request, res: Response) => {
  try {
    const {
      nome, email, senha, telefone, cpf, data_nascimento,
      queixa_principal, historico_medico, medicamentos, objetivos, observacoes,
    } = req.body;

    if (!nome || !email || !senha) {
      res.status(400).json({ error: 'Nome, email e senha são obrigatórios' });
      return;
    }

    // Verificar se e-mail já existe
    const existing = await query('SELECT id FROM usuarios WHERE email = $1', [email.toLowerCase().trim()]);
    if (existing.rows.length > 0) {
      res.status(409).json({ error: 'Email já cadastrado' });
      return;
    }

    // Hash da senha
    const senha_hash = await bcrypt.hash(senha, 10);

    // Inserir usuário
    const userResult = await query(`
      INSERT INTO usuarios (nome, email, senha_hash, role, telefone, cpf, data_nascimento)
      VALUES ($1, $2, $3, 'paciente', $4, $5, $6)
      RETURNING id
    `, [nome, email.toLowerCase().trim(), senha_hash, telefone, cpf, data_nascimento]);

    const usuario_id = userResult.rows[0].id;

    // Inserir dados clínicos do paciente
    const pacienteResult = await query(`
      INSERT INTO pacientes (usuario_id, queixa_principal, historico_medico, medicamentos, objetivos, observacoes, profissional_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `, [usuario_id, queixa_principal, historico_medico, medicamentos, objetivos, observacoes, req.user!.userId]);

    res.status(201).json({ ...pacienteResult.rows[0], nome, email });
  } catch (err) {
    console.error('[PACIENTES CREATE]', err);
    res.status(500).json({ error: 'Erro ao cadastrar paciente' });
  }
});

/**
 * PUT /pacientes/:id
 * Atualiza dados de um paciente
 */
router.put('/:id', requireRole('admin', 'profissional'), async (req: Request, res: Response) => {
  try {
    const {
      nome, telefone, cpf, data_nascimento,
      queixa_principal, historico_medico, medicamentos, objetivos, observacoes,
    } = req.body;

    // Buscar paciente
    const paciente = await query('SELECT usuario_id FROM pacientes WHERE id = $1', [req.params.id]);
    if (paciente.rows.length === 0) {
      res.status(404).json({ error: 'Paciente não encontrado' });
      return;
    }

    const usuario_id = paciente.rows[0].usuario_id;

    // Atualizar usuário
    if (nome || telefone || cpf || data_nascimento) {
      await query(`
        UPDATE usuarios SET
          nome = COALESCE($1, nome),
          telefone = COALESCE($2, telefone),
          cpf = COALESCE($3, cpf),
          data_nascimento = COALESCE($4, data_nascimento)
        WHERE id = $5
      `, [nome, telefone, cpf, data_nascimento, usuario_id]);
    }

    // Atualizar dados clínicos
    const result = await query(`
      UPDATE pacientes SET
        queixa_principal = COALESCE($1, queixa_principal),
        historico_medico = COALESCE($2, historico_medico),
        medicamentos = COALESCE($3, medicamentos),
        objetivos = COALESCE($4, objetivos),
        observacoes = COALESCE($5, observacoes)
      WHERE id = $6
      RETURNING *
    `, [queixa_principal, historico_medico, medicamentos, objetivos, observacoes, req.params.id]);

    res.json(result.rows[0]);
  } catch (err) {
    console.error('[PACIENTES UPDATE]', err);
    res.status(500).json({ error: 'Erro ao atualizar paciente' });
  }
});

/**
 * DELETE /pacientes/:id
 * Remove um paciente (cascade para usuario)
 */
router.delete('/:id', requireRole('admin'), async (req: Request, res: Response) => {
  try {
    const paciente = await query('SELECT usuario_id FROM pacientes WHERE id = $1', [req.params.id]);
    if (paciente.rows.length === 0) {
      res.status(404).json({ error: 'Paciente não encontrado' });
      return;
    }

    // Deletar o usuario (cascade deleta paciente)
    await query('DELETE FROM usuarios WHERE id = $1', [paciente.rows[0].usuario_id]);

    res.json({ message: 'Paciente removido com sucesso' });
  } catch (err) {
    console.error('[PACIENTES DELETE]', err);
    res.status(500).json({ error: 'Erro ao remover paciente' });
  }
});

export default router;
