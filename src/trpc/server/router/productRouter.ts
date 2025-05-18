import { productService } from '../services';
import { router, publicProcedure, protectedProcedure } from "../trpc";
import { z } from 'zod';
import { productSchema, paginationQuerySchema } from '@/trpc/schemas';
import { TRPCError } from '@trpc/server';

export default router({
  getAll: publicProcedure.query(async () => {
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

  getAllPaged: publicProcedure
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

  getById: publicProcedure.input(z.string()).query(async ({ input }) => {
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

  save: protectedProcedure.input(productSchema).mutation(async ({ input }) => {
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

  delete: protectedProcedure.input(z.string()).mutation(async ({ input }) => {
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
