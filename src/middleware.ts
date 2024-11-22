import { MiddlewareConfig, NextRequest, NextResponse } from "next/server";

export default function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const isUserToken = req.cookies.has("id");

  if (!isUserToken) {
    url.pathname = "/login";
    return NextResponse.redirect(url); // Retorna o redirecionamento
  }

  return NextResponse.next();
}

export const config: MiddlewareConfig = {
  matcher: ["/cesta/:path*", "/admin/:path*", "/config/:path*"]
};
