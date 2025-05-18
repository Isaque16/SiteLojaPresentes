import { IncomingMessage } from 'http';
import { createDbContext, createAuthContext } from "@/trpc/server/contexts";
import { authService } from './services';

export interface Context {
  user: {
    id: string;
  } | null;
  db: void;
}

/**
 * Cria o contexto para as requisições tRPC
 * Combina o contexto de banco de dados com as informações do usuário autenticado
 */
export async function createContext({ req }: { req: IncomingMessage }): Promise<Context> {
  const dbContext: { db: void } = await createDbContext();

  const token = createAuthContext(req);
  let user = null;

  if (token) {
    try {
      const userId: string | null = await authService.getCurrentUser(token);
      if (userId) {
        user = { id: userId };
      }
    } catch (error) {
      console.error('Erro ao verificar autenticação:', error);
    }
  }

  return {
    db: dbContext.db,
    user
  };
}
