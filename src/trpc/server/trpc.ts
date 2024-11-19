import connectToDatabase from "@/server/database/connectDB";
import { initTRPC } from "@trpc/server";

export const createContext = async () => {
  await connectToDatabase(); // Garantir que está no local certo
  return {};
};

// Inicializa o tRPC
const t = initTRPC.context<typeof createContext>().create();

export const router = t.router;
export const procedure = t.procedure;
