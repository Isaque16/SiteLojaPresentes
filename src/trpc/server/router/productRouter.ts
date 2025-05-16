import { productService } from '../services';
import { router, procedure } from '../trpc';
import { z } from 'zod';
import { productSchema } from '@/trpc/schemas';
import { TRPCError } from '@trpc/server';

/**
 * Product Router - Handles all product-related API endpoints
 */
export default router({
  /**
   * Retrieves all products from the database
   *
   * @returns {Promise<IProduct[]>} Array of all products
   * @throws {TRPCError} With code 'INTERNAL_SERVER_ERROR' if fetching fails
   */
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

  /**
   * Finds a product by its ID
   *
   * @param {string} input - The product ID to search for
   * @returns {Promise<IProduct>} The found product object
   * @returns null if no product is found
   * @throws {TRPCError} With code 'NOT_FOUND' if product doesn't exist
   */
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

  /**
   * Creates or updates a product in the database
   *
   * @param {object} input - The product data validated by productSchema
   * @returns {Promise<{message: string}>} Success confirmation message
   * @throws {TRPCError} With code 'BAD_REQUEST' if saving fails
   */
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

  /**
   * Removes a product from the database by its ID
   *
   * @param {string} input - The product ID to delete
   * @returns {Promise<{message: string}>} Success confirmation message
   * @throws {TRPCError} With code 'BAD_REQUEST' if deletion fails
   */
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
