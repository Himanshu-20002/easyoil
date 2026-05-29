import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Let public assets and auth APIs pass through
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api/auth') ||
    pathname.startsWith('/api/register') ||
    pathname.startsWith('/api/db/seed') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.startsWith('/uploads') ||
    pathname === '/' ||
    pathname === '/login' ||
    pathname === '/register'
  ) {
    const response = NextResponse.next();
    // Add Security Headers
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    response.headers.set('X-XSS-Protection', '1; mode=block');
    return response;
  }

  // Get token
  const token = await getToken({
    req: request,
    secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
  });

  // If no token and trying to access dashboard/portal, redirect to login
  if (!token) {
    const loginUrl = new URL('/login', request.url);
    // Remember current path to redirect back after login
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  const role = token.role as string;

  // Role routing enforcement
  if (pathname.startsWith('/customer') && role !== 'customer') {
    return NextResponse.redirect(new URL(getHomeForRole(role), request.url));
  }

  if (pathname.startsWith('/officer') && role !== 'sales_officer' && role !== 'admin') {
    return NextResponse.redirect(new URL(getHomeForRole(role), request.url));
  }

  if (pathname.startsWith('/admin') && role !== 'admin') {
    return NextResponse.redirect(new URL(getHomeForRole(role), request.url));
  }

  const response = NextResponse.next();
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  return response;
}

function getHomeForRole(role: string): string {
  switch (role) {
    case 'admin':
      return '/admin/dashboard';
    case 'sales_officer':
      return '/officer/dashboard';
    case 'customer':
      return '/customer/dashboard';
    default:
      return '/login';
  }
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|public|api/auth).*)',
  ],
};
