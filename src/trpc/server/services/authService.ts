'use server';
import bcrypt from 'bcrypt';
import { ICustomer } from '@/interfaces';
import { getCookie, setCookie, deleteCookie } from 'cookies-next/server';
import { customerService } from '../services';
import { cookies } from 'next/headers';

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
): Promise<{ success: boolean; userId?: string; message: string }> {
  try {
    const customer: ICustomer | null =
      await customerService.findCustomerByUserName(nomeUsuario);

    if (!customer) {
      return {
        success: false,
        message: 'nome de usuário ou senha incorretos'
      };
    }

    const isPasswordValid = await bcrypt.compare(senha, customer.senha);

    if (!isPasswordValid) {
      return {
        success: false,
        message: 'nome de usuário ou senha incorretos'
      };
    }

    return {
      success: true,
      userId: customer._id!,
      message: 'Login realizado com sucesso!'
    };
  } catch (error) {
    throw new Error(`Erro ao autenticar usuário: ${error}`);
  }
}

/**
 * Creates a user session by setting a secure browser cookie with the provided user ID.
 *
 * @param {string} userId - The unique identifier of the user to create a session for.
 * @return {Promise<void>} A promise that resolves when the user session is successfully created, or throws an error if the process fails.
 */
export async function createUserSession(userId: string): Promise<void> {
  try {
    await setCookie('user_session', userId.toString(), {
      cookies,
      maxAge: 60 * 60 * 24 * 7, // 7 dias
      path: '/'
    });
  } catch (error) {
    throw new Error(`Erro ao criar sessão do usuário: ${error}`);
  }
}

/**
 * Logs out the currently authenticated user by removing their session cookie.
 *
 * @return {Promise<void>} A promise that resolves when the user is successfully logged out.
 * @throws {Error} If an error occurs while attempting to log out the user.
 */
export async function logoutUser(): Promise<void> {
  try {
    await deleteCookie('user_session', { cookies });
  } catch (error) {
    throw new Error(`Erro ao encerrar sessão do usuário: ${error}`);
  }
}

/**
 * Retrieves the current user session identifier if available.
 *
 * @return {Promise<string|null>} A promise that resolves to the current user's session as a string, or null if no session is found.
 */
export async function getCurrentUser(): Promise<string | null> {
  try {
    const sessionCookie = await getCookie('user_session', { cookies });
    return sessionCookie || null;
  } catch (error) {
    throw new Error(`Erro ao verificar sessão atual: ${error}`);
  }
}
