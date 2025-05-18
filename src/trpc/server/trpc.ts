import { initTRPC, TRPCError } from '@trpc/server';
import { Context } from '@/trpc/server/context';
import { authService } from './services';

const t = initTRPC.context<Context>().create();

// Middleware to check if the user is authenticated
const isAuthenticated = t.middleware(async ({ ctx, next }) => {
  if (!ctx.user || !ctx.user.id) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'Você precisa estar autenticado',
    });
  }

  const result = await next({
    ctx: {
      user: ctx.user,
    },
  });

  const newToken = await authService.renewToken(ctx.user.id);

  return {
    ...result,
    token: newToken,
  };
});

export const router = t.router;
const procedure = t.procedure;
export const publicProcedure = procedure;
export const protectedProcedure = procedure.use(isAuthenticated);
