import { MiddlewareConfig, NextRequest, NextResponse } from 'next/server';

export default function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const isUserToken = req.cookies.has('authToken');

  if (!isUserToken) {
    url.pathname = '/cadastro';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config: MiddlewareConfig = {
  matcher: [
    '/cesta/:path*',
    '/config/:path*',
    '/historico/:path*',
    '/admin/:path*'
  ]
};
