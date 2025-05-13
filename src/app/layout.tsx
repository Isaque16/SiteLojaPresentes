import "../globals.css";
import type { Metadata } from "next";
import localFont from "next/font/local";
import TRPCProvider from "@/trpc/client/TRPCProvider";
import { NavBar, Footer } from "@/layout";
import { ToastProvider } from "@/contexts";

const geistSans = localFont({
  src: "/fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900"
});
const geistMono = localFont({
  src: "/fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900"
});

export const metadata: Metadata = {
  title: "Crer Presentes",
  description: "Loja de presentes personalizados"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <TRPCProvider>
          <ToastProvider>
            <NavBar />
            {children}
            <Footer />
          </ToastProvider>
        </TRPCProvider>
      </body>
    </html>
  );
}
