import bcrypt from 'bcrypt';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { ICustomer } from '@/interfaces';
import { customerService } from '../services';

const JWT_SECRET = process.env.JWT_SECRET as string;
const TOKEN_EXPIRATION = '7d';

/**
 * Authenticates a user by validating the provided email and password.
 *
 * @param {string} nomeUsuario - The user name of the user to authenticate.
 * @param {string} senha - The password of the user to authenticate.
 * @return {Promise<{success: boolean, message?: string}>}
 * A promise resolving to an object indicating the authentication result. If successful,
 * `success` will be true and the authenticated customer will be included in the response.
 * Otherwise, `success` will be false with an optional error message.
 */
export async function authenticateUser(
  nomeUsuario: string,
  senha: string
): Promise<{
  success: boolean;
  userId?: string;
  token?: string;
  message: string;
}> {
  try {
    const customer: ICustomer | null =
      await customerService.findCustomerByUserName(nomeUsuario);

    if (!customer) {
      return {
        success: false,
        message: 'nome de usuário incorreto'
      };
    }

    const isPasswordValid: boolean = await bcrypt.compare(senha, customer.senha);

    if (!isPasswordValid) {
      return {
        success: false,
        message: 'Senha incorreta'
      };
    }

    const token: string = generateToken(customer._id!);

    return {
      success: true,
      userId: customer._id,
      token,
      message: 'Login realizado com sucesso!'
    };
  } catch (error) {
    throw new Error(`Erro ao autenticar usuário: ${error}`);
  }
}

/**
 * Verifies and decodes a JWT token.
 *
 * @param {string} token - The JWT token to verify.
 * @return {JwtPayload | string | null} The decoded token payload if valid, null otherwise.
 */
export function verifyToken(token: string): JwtPayload | string | null {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

/**
 * Retrieves the current user ID from a JWT token.
 *
 * @param {string} token - The JWT token to extract the user ID from.
 * @return {Promise<string|null>} A promise that resolves to the current user's ID, or null if the token is invalid.
 */
export async function getCurrentUser(token: string): Promise<string | null> {
  try {
    const decoded = verifyToken(token) as JwtPayload;
    return decoded?.userId || null;
  } catch (error) {
    throw new Error(`Erro ao verificar sessão atual: ${error}`);
  }
}

/**
 * Renews a JWT token by generating a new one for the provided user ID.
 *
 * @param {string} token - The JWT token to renew.
 * @return {Promise<string>} A promise that resolves with the renewed token.
 */
export async function renewToken(token: string) {
  try {
    const decoded = verifyToken(token) as JwtPayload;

    const userId = decoded.userId;
    return generateToken(userId);
  } catch (error) {
    throw new Error(`Erro ao renovar token: ${error}`);
  }
}

/**
 * Generates a JWT token for the provided user ID.
 *
 * @param {string} userId - The unique identifier of the user.
 * @return {string} The generated JWT token.
 */
function generateToken(userId: string): string {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: TOKEN_EXPIRATION });
}
