import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { NextResponse } from 'next/server';

// Next.js 16: "middleware" renamed to "proxy"
const intlMiddleware = createMiddleware(routing);

export function proxy(request: Parameters<typeof intlMiddleware>[0]) {
  const { pathname } = request.nextUrl;

  // Rewrites for static metadata files requested with locale prefix
  if (pathname.endsWith('/favicon.ico')) {
    return NextResponse.rewrite(new URL('/favicon.ico', request.url));
  }
  if (pathname.endsWith('/favicon.svg')) {
    return NextResponse.rewrite(new URL('/favicon.svg', request.url));
  }
  if (pathname.endsWith('/icon.svg')) {
    return NextResponse.rewrite(new URL('/icon.svg', request.url));
  }
  if (pathname.endsWith('/robots.txt')) {
    return NextResponse.rewrite(new URL('/robots.txt', request.url));
  }
  if (pathname.endsWith('/sitemap.xml')) {
    return NextResponse.rewrite(new URL('/sitemap.xml', request.url));
  }

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
  matcher: ['/((?!_next/static|_next/image|favicon.ico|favicon.svg|icon.svg|robots.txt|sitemap.xml).*)']
};
