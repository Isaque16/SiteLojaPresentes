import { IncomingMessage } from 'http';
import { createDbContext, createAuthContext } from "@/trpc/server/contexts";
import { authService } from './services';

interface User {
  id: string;
}

/**
 * Cria o contexto para as requisições tRPC
 * Gerencia a conexão com o banco de dados e autenticação do usuário
 */
export const createContext = async (opts: {
  req: Request | IncomingMessage;
}) => {
  const req = opts.req instanceof Request
    ? new IncomingMessage(null as any)
    : opts.req;

  const dbContext = await createDbContext();

  const token = createAuthContext(req);
  let user: User | null = null;

  if (token) {
    try {
      const userId = await authService.getCurrentUser(token);
      if (userId) {
        user = { id: userId };
      }
    } catch (error) {
      console.error('Erro ao verificar autenticação:', error);
    }
  }

  return {
    db: dbContext.db,
    user,
    token
  };
};

export type Context = Awaited<ReturnType<typeof createContext>>;
