import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Token fica em localStorage (cliente). Proteção de rotas é feita via AuthContext/ProtectedRoute.
// Middleware pode ser usado para outras regras (ex.: rate limit, headers).
export function middleware(_request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|assets).*)'],
};
