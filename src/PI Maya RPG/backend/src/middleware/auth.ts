// Middleware de autenticação — protege as rotas do backend.
// Verifica o token JWT que vem no header "Authorization: Bearer ..."
// e extrai os dados do usuário logado (id, email, role).

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Os dados que ficam "dentro" do token JWT
export interface JwtPayload {
  userId: string;
  email: string;
  role: 'admin' | 'profissional' | 'paciente';
}

// Extende o Request do Express pra incluir req.user em todas as rotas
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

// Chave secreta pra assinar/verificar tokens. Em produção, NUNCA usar a default!
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-troque-em-producao';

// Middleware principal: verifica se o token é válido.
// Se for, coloca os dados do usuário em req.user e deixa passar.
// Se não, retorna 401 (não autorizado).
export function authMiddleware(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  // Verifica se o header existe e começa com "Bearer "
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Token de autenticação não fornecido' });
    return;
  }

  // Extrai o token do header (tira o "Bearer " da frente)
  const token = authHeader.split(' ')[1];

  try {
    // Decodifica e valida o token
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    req.user = decoded;  // disponibiliza os dados nas rotas seguintes
    next();
  } catch {
    res.status(401).json({ error: 'Token inválido ou expirado' });
    return;
  }
}

// Middleware de permissão: verifica se o usuário tem a role necessária.
// Uso: router.get('/rota', authMiddleware, requireRole('admin'), handler)
export function requireRole(...roles: string[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: 'Não autenticado' });
      return;
    }

    // Se a role do usuário não tá na lista permitida, bloqueia
    if (!roles.includes(req.user.role)) {
      res.status(403).json({ error: 'Acesso negado — permissão insuficiente' });
      return;
    }

    next();
  };
}

// Gera um token JWT pro usuário (usado no login)
export function generateToken(payload: JwtPayload): string {
  const expiresIn = process.env.JWT_EXPIRES_IN || '24h';
  return jwt.sign(payload, JWT_SECRET, { expiresIn: expiresIn as any });
}
