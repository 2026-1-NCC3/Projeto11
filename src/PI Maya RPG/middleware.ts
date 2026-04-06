import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Token fica em localStorage (cliente). Proteção de rotas é feita via AuthContext/ProtectedRoute.
// Middleware desativado: sem regras ativas no momento.
// Para reativar, descomente o matcher e adicione lógica ao handler.
export function middleware(_request: NextRequest) {
  return NextResponse.next();
}

// Matcher vazio = middleware não executa em nenhuma rota (zero overhead)
export const config = {
  matcher: [],
};
