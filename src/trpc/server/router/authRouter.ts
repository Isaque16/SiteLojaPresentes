import { router, publicProcedure } from '@/trpc/server/trpc';
import { TRPCError } from '@trpc/server';
import { authService } from '../services';
import { z } from 'zod';

export default router({
  /**
   * Authenticates a user and creates a session
   *
   * @param {object} input - User credentials
   * @param {string} input.nomeUsuario - The user's username
   * @param {string} input.senha - The user's password
   * @returns {Promise<{success: boolean, token?: string, message?: string}>} Authentication result
   */
  login: publicProcedure
    .input(z.object({ nomeUsuario: z.string(), senha: z.string() }))
    .mutation(async ({ input }) => {
      try {
        const authResult = await authService.authenticateUser(
          input.nomeUsuario,
          input.senha
        );

        if (authResult.success) {
          return {
            success: true,
            userId: authResult.userId,
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
   * Checks if the user is authenticated
   *
   * @returns {Promise<{isLoggedIn: boolean, userId: string|null}>} Session status
   */
  checkSession: publicProcedure.input(z.string()).query(async ({ input }) => {
    try {
      const userId = await authService.getCurrentUser(input);
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
