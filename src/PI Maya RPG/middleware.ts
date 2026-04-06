// Middleware do Next.js — roda antes de cada requisição no servidor.
// Por enquanto está DESATIVADO (matcher vazio = não intercepta nada).
// A proteção de rotas é feita no lado do cliente pelo AuthContext e ProtectedRoute.
// Se quiser reativar no futuro (ex: proteção server-side), é só adicionar rotas no matcher.

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(_request: NextRequest) {
  // Deixa passar tudo — sem regras ativas no momento
  return NextResponse.next();
}

// Matcher vazio = middleware não executa em nenhuma rota (zero overhead)
export const config = {
  matcher: [],
};
