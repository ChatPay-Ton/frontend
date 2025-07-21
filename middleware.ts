import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Verificar se a requisição é para uma rota protegida
  const { pathname } = request.nextUrl;

  // Rotas que não precisam de autenticação
  const publicPaths = [
    '/login',
    '/api/',
    '/_next/',
    '/favicon.ico',
    '/ChatPay-Go-1.png',
    '/manifest.json'
  ];

  // Verificar se a rota é pública
  const isPublicPath = publicPaths.some(path => pathname.startsWith(path));

  if (isPublicPath) {
    return NextResponse.next();
  }

  // Verificar autenticação via header ou cookie
  const authHeader = request.headers.get('authorization');
  const authCookie = request.cookies.get('tonconnect_auth');

  // Para o root path (/), verificar se está autenticado
  if (pathname === '/') {
    // Se não há indicação de autenticação, permitir acesso
    // A verificação real será feita no lado do cliente
    return NextResponse.next();
  }

  // Para rotas protegidas específicas (se houver no futuro)
  const protectedPaths = [
    '/dashboard',
    '/profile',
    '/settings'
  ];

  const isProtectedPath = protectedPaths.some(path => pathname.startsWith(path));

  if (isProtectedPath) {
    // Verificar se há token de autenticação
    if (!authHeader && !authCookie) {
      // Redirecionar para login se não autenticado
      return NextResponse.redirect(new URL('/?login=required', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}; 