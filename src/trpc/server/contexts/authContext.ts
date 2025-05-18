import { IncomingMessage } from 'http';

/**
 * This function extracts the Bearer token from the Authorization header of the incoming request.
 * It returns the token if present, otherwise returns null.
 *
 * @param req - The incoming HTTP request object.
 * @returns The Bearer token or null if not present.
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
