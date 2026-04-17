import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { NextResponse } from 'next/server';

// Next.js 16: "middleware" renamed to "proxy"
const intlMiddleware = createMiddleware(routing);

export function proxy(request: Parameters<typeof intlMiddleware>[0]) {
  const { pathname } = request.nextUrl;
  // API routes, static files ve Next.js internals'ı atla
  if (
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/_vercel/') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }
  return intlMiddleware(request);
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)']
};
