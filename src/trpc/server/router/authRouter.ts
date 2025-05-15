import { router, procedure } from '@/trpc/server/trpc';
import { TRPCError } from '@trpc/server';
import {
  authenticateUser,
  createUserSession,
  logoutUser,
  getCurrentUser
} from '../services';
import { z } from 'zod';

export default router({
  /**
   * Authenticates a user and creates a session
   *
   * @param {object} input - User credentials
   * @param {string} input.nomeUsuario - The user's username
   * @param {string} input.senha - The user's password
   * @returns {Promise<{success: boolean, customer: ICustomer, message?: string}>} Authentication result
   */
  login: procedure
    .input(z.object({ nomeUsuario: z.string(), senha: z.string() }))
    .mutation(async ({ input }) => {
      try {
        const authResult = await authenticateUser(
          input.nomeUsuario,
          input.senha
        );

        if (authResult.success) {
          await createUserSession(authResult.userId!);
          return {
            success: true,
            message: 'Login realizado com sucesso'
          };
        }

        return {
          success: false,
          message: authResult.message || 'Falha na autenticação'
        };
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Erro ao processar login',
          cause: error
        });
      }
    }),

  /**
   * Ends the current user's session
   *
   * @returns {Promise<{success: boolean, message: string}>} Logout confirmation
   */
  logout: procedure.mutation(async () => {
    try {
      await logoutUser();
      return {
        success: true,
        message: 'Logout realizado com sucesso'
      };
    } catch (error) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Erro ao processar logout',
        cause: error
      });
    }
  }),

  /**
   * Checks if the user is authenticated
   *
   * @returns {Promise<{isLoggedIn: boolean, userId: string|null}>} Session status
   */
  checkSession: procedure.query(async () => {
    try {
      const userId = await getCurrentUser();
      return {
        isLoggedIn: !!userId,
        userId
      };
    } catch (error) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Erro ao verificar sessão',
        cause: error
      });
    }
  })
});
