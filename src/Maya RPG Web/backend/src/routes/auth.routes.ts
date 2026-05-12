import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { query } from '../config/database';
import { generateToken, authMiddleware } from '../middleware/auth';

const router = Router();

/**
 * POST /auth/login
 * Body: { email, senha }
 * Retorna: { access_token, user }
 */
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      res.status(400).json({ error: 'Email e senha são obrigatórios' });
      return;
    }

    // Buscar usuário pelo email
    const result = await query(
      'SELECT id, nome, email, senha_hash, role, telefone, avatar_url, ativo FROM usuarios WHERE email = $1',
      [email.toLowerCase().trim()]
    );

    if (result.rows.length === 0) {
      res.status(401).json({ error: 'Credenciais inválidas' });
      return;
    }

    const usuario = result.rows[0];

    if (!usuario.ativo) {
      res.status(403).json({ error: 'Conta desativada. Entre em contato com a clínica.' });
      return;
    }

    // Verificar senha
    const senhaValida = await bcrypt.compare(senha, usuario.senha_hash);
    if (!senhaValida) {
      res.status(401).json({ error: 'Credenciais inválidas' });
      return;
    }

    // Gerar token
    const token = generateToken({
      userId: usuario.id,
      email: usuario.email,
      role: usuario.role,
    });

    // Retornar sem a senha
    const { senha_hash, ...userSemSenha } = usuario;

    // Se for paciente, buscar paciente_id
    let paciente_id: string | null = null;
    if (usuario.role === 'paciente') {
      const pacResult = await query(
        'SELECT id FROM pacientes WHERE usuario_id = $1',
        [usuario.id]
      );
      if (pacResult.rows.length > 0) {
        paciente_id = pacResult.rows[0].id;
      }
    }

    res.json({
      access_token: token,
      user: {
        id: userSemSenha.id,
        nome: userSemSenha.nome,
        email: userSemSenha.email,
        role: userSemSenha.role,
        telefone: userSemSenha.telefone,
        avatar_url: userSemSenha.avatar_url,
        paciente_id,
      },
    });
  } catch (err) {
    console.error('[AUTH LOGIN]', err);
    res.status(500).json({ error: 'Erro ao realizar login' });
  }
});

/**
 * GET /auth/me
 * Retorna dados do usuário autenticado (via JWT)
 * Se for paciente, inclui paciente_id
 */
router.get('/me', authMiddleware, async (req: Request, res: Response) => {
  try {
    const result = await query(
      'SELECT id, nome, email, role, telefone, avatar_url, ativo FROM usuarios WHERE id = $1',
      [req.user!.userId]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Usuário não encontrado' });
      return;
    }

    const usuario = result.rows[0];

    let paciente_id: string | null = null;
    if (usuario.role === 'paciente') {
      const pacResult = await query(
        'SELECT id FROM pacientes WHERE usuario_id = $1',
        [usuario.id]
      );
      if (pacResult.rows.length > 0) {
        paciente_id = pacResult.rows[0].id;
      }
    }

    res.json({
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      role: usuario.role,
      telefone: usuario.telefone,
      avatar_url: usuario.avatar_url,
      paciente_id,
    });
  } catch (err) {
    console.error('[AUTH ME]', err);
    res.status(500).json({ error: 'Erro ao buscar dados do usuário' });
  }
});

/**
 * POST /auth/register
 * Body: { nome, email, senha, telefone? }
 * Cria um novo usuário com role 'paciente' e registro na tabela pacientes.
 * Retorna: { access_token, user } (auto-login após cadastro)
 */
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { nome, email, senha, telefone } = req.body;

    if (!nome || !email || !senha) {
      res.status(400).json({ error: 'Nome, email e senha são obrigatórios' });
      return;
    }

    if (senha.length < 6) {
      res.status(400).json({ error: 'A senha deve ter pelo menos 6 caracteres' });
      return;
    }

    // Verificar se email já existe
    const existente = await query(
      'SELECT id FROM usuarios WHERE email = $1',
      [email.toLowerCase().trim()]
    );

    if (existente.rows.length > 0) {
      res.status(409).json({ error: 'Este email já está cadastrado' });
      return;
    }

    // Hash da senha
    const senha_hash = await bcrypt.hash(senha, 10);

    // Criar usuário
    const userResult = await query(`
      INSERT INTO usuarios (nome, email, senha_hash, role, telefone)
      VALUES ($1, $2, $3, 'paciente', $4)
      RETURNING id, nome, email, role, telefone, avatar_url
    `, [nome.trim(), email.toLowerCase().trim(), senha_hash, telefone || null]);

    const usuario = userResult.rows[0];

    // Criar registro de paciente
    const pacResult = await query(`
      INSERT INTO pacientes (usuario_id)
      VALUES ($1)
      RETURNING id
    `, [usuario.id]);

    const paciente_id = pacResult.rows[0].id;

    // Gerar token (auto-login)
    const token = generateToken({
      userId: usuario.id,
      email: usuario.email,
      role: usuario.role,
    });

    res.status(201).json({
      access_token: token,
      user: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        role: usuario.role,
        telefone: usuario.telefone,
        avatar_url: usuario.avatar_url,
        paciente_id,
      },
    });
  } catch (err) {
    console.error('[AUTH REGISTER]', err);
    res.status(500).json({ error: 'Erro ao realizar cadastro' });
  }
});

/**
 * POST /auth/logout
 * (Stateless — apenas confirma ao cliente)
 */
router.post('/logout', (_req: Request, res: Response) => {
  res.json({ message: 'Logout realizado com sucesso' });
});

export default router;
