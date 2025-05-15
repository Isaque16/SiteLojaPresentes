import {
  findCustomerById,
  findCustomerByUserName,
  getAllCustomers,
  removeCustomerByUserName,
  saveCustomer,
  saveCustomerAdress
} from '../services';
import { procedure, router } from '../trpc';
import { z } from 'zod';
import { customerSchema, addressSchema } from '@/trpc/schemas';
import { TRPCError } from '@trpc/server';

/**
 * Customer Router - Handles all customer-related API endpoints
 */
export default router({
  /**
   * Retrieves all customers from the database
   *
   * @returns {Promise<ICustomer[]>} Array of all customers
   * @throws {TRPCError} With code 'INTERNAL_SERVER_ERROR' if fetching fails
   */
  getAll: procedure.query(async () => {
    try {
      return await getAllCustomers();
    } catch (error) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Erro ao buscar clientes',
        cause: error
      });
    }
  }),

  /**
   * Finds a customer by their username
   *
   * @param {string} input - The username to search for
   * @returns {Promise<ICustomer>} The found customer object
   * @throws {TRPCError} With code 'NOT_FOUND' if customer doesn't exist
   */
  getByUserName: procedure.input(z.string()).query(async ({ input }) => {
    try {
      return await findCustomerByUserName(input);
    } catch (error) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Falha ao buscar o cliente pelo userName',
        cause: error
      });
    }
  }),

  /**
   * Finds a customer by their ID
   *
   * @param {string} input - The customer ID to search for
   * @returns {Promise<ICustomer>} The found customer object
   * @throws {TRPCError} With code 'NOT_FOUND' if customer doesn't exist
   */
  getById: procedure.input(z.string()).query(async ({ input }) => {
    try {
      return await findCustomerById(input);
    } catch (error) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Falha ao buscar o cliente pelo ID',
        cause: error
      });
    }
  }),

  /**
   * Creates or updates a customer in the database
   *
   * @param {object} input - The customer data validated by customerSchema
   * @returns {Promise<ICustomer>} The created/updated customer object
   * @throws {TRPCError} With code 'BAD_REQUEST' if saving fails
   */
  save: procedure.input(customerSchema).mutation(async ({ input }) => {
    try {
      return await saveCustomer(input);
    } catch (error) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Erro ao criar cliente',
        cause: error
      });
    }
  }),

  /**
   * Adds or updates an address for a specific customer
   *
   * @param {object} input - Object containing customer ID and address data
   * @param {string} input._id - The customer ID
   * @param {object} input.endereco - The address data validated by addressSchema
   * @returns {Promise<{message: string}>} Success confirmation message
   * @throws {TRPCError} With code 'BAD_REQUEST' if saving address fails
   */
  saveEndereco: procedure
    .input(z.object({ _id: z.string(), endereco: addressSchema }))
    .mutation(async ({ input }) => {
      try {
        await saveCustomerAdress(input._id, input.endereco);
        return { message: 'Endereço salvo com sucesso!' };
      } catch (error) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Erro ao salvar endereço',
          cause: error
        });
      }
    }),

  /**
   * Removes a customer from the database by username
   *
   * @param {string} input - The username of the customer to delete
   * @returns {Promise<{message: string}>} Success confirmation message
   * @throws {TRPCError} With code 'BAD_REQUEST' if deletion fails
   */
  delete: procedure.input(z.string()).mutation(async ({ input }) => {
    try {
      await removeCustomerByUserName(input);
      return { message: 'Cliente removido com sucesso!' };
    } catch (error) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Erro ao remover cliente',
        cause: error
      });
    }
  })
});
