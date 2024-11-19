import { appRouter } from "@/trpc/server/router/appRouter";
import { createContext } from "@/trpc/server/trpc";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";

export const runtime = "nodejs";

export async function handler(req: Request) {
  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: createContext
  });
}

export { handler as GET, handler as POST, handler as PUT, handler as DELETE };
