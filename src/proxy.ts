import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

// Next.js 16: "middleware" renamed to "proxy"
const intlMiddleware = createMiddleware(routing);

export function proxy(request: Parameters<typeof intlMiddleware>[0]) {
  return intlMiddleware(request);
}

export const config = {
  matcher: ['/', '/(tr|en|ar|fr)/:path*', '/((?!api|_next|_vercel|.*\\..*).*)']
};
