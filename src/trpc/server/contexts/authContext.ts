import { IncomingMessage } from 'http';

/**
 * Extrai o token JWT do cabeçalho de autorização
 */
export function createAuthContext(req: IncomingMessage): string | null {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return null;
  }

  const [prefix, token] = authHeader.split(' ');

  if (prefix !== 'Bearer' || !token) {
    return null;
  }

  return token;
}

// export type AuthContext = Awaited<ReturnType<typeof createAuthContext>>;
