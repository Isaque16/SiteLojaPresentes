import '../globals.css';
import type { Metadata } from 'next';
import localFont from 'next/font/local';
import TRPCProvider from '@/trpc/client/TRPCProvider';
import { NavBar, Footer } from '@/layout';
import { ToastProvider, AuthProvider } from '@/contexts';
import { type ReactNode } from "react";

const geistSans = localFont({
  src: '/fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900'
});
const geistMono = localFont({
  src: '/fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900'
});

export const metadata: Metadata = {
  title: 'Crer Presentes',
  description: 'Loja de presentes personalizados'
};

export default function RootLayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <TRPCProvider>
          <ToastProvider>
            <AuthProvider>
              <NavBar />
              {children}
              <Footer />
            </AuthProvider>
          </ToastProvider>
        </TRPCProvider>
      </body>
    </html>
  );
}
