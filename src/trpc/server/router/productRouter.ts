import { productService } from '../services';
import { router, procedure } from '../trpc';
import { z } from 'zod';
import { productSchema, paginationQuerySchema } from '@/trpc/schemas';
import { TRPCError } from '@trpc/server';

export default router({
  getAll: procedure.query(async () => {
    try {
      return await productService.getAllProducts();
    } catch (error) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to fetch products',
        cause: error
      });
    }
  }),

  getAllPaged: procedure
    .input(paginationQuerySchema)
    .query(async ({ input }) => {
      try {
        return await productService.getAllProductsPaged(input);
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch products',
          cause: error
        });
      }
    }),

  getById: procedure.input(z.string()).query(async ({ input }) => {
    try {
      return await productService.findProductById(input);
    } catch (error) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Product not found',
        cause: error
      });
    }
  }),

  save: procedure.input(productSchema).mutation(async ({ input }) => {
    try {
      await productService.saveProduct(input);
      return { message: 'Estoque atualizado com sucesso!' };
    } catch (error) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Erro ao salvar produto',
        cause: error
      });
    }
  }),

  delete: procedure.input(z.string()).mutation(async ({ input }) => {
    try {
      await productService.removeProductById(input);
      return { message: 'Produto removido com sucesso!' };
    } catch (error) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Erro ao remover produto',
        cause: error
      });
    }
  })
});
