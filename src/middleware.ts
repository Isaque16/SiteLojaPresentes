import { NextRequest, NextResponse } from "next/server";

export default function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const isUserToken = req.cookies.has("id");
  const isNotAllowedUrl =
    url.pathname.startsWith("/cesta") || url.pathname.startsWith("/admin");

  if (!isUserToken && isNotAllowedUrl) {
    url.pathname = "/login";
    return NextResponse.redirect(url); // Retorna o redirecionamento
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/cesta/:path*", "/admin/:path*"]
};
