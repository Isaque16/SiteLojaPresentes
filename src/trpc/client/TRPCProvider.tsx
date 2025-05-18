'use client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { type ReactNode, useState } from "react";
import { httpBatchLink } from '@trpc/client';
import trpc from './trpc';
import { getCookie } from "cookies-next/client";

export default function TRPCProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() => {
    return trpc.createClient({
      links: [
        httpBatchLink({
          url: '/api/trpc',
          headers() {
            const token = getCookie('authToken');
            return {
              authorization: token ? `Bearer ${token}` : '',
            };
          }
        }),
      ]
    });
  });

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
  );
}
