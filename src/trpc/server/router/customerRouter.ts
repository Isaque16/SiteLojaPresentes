import { customerService } from '../services';
import { procedure, router } from '../trpc';
import { z } from 'zod';
import {
  customerSchema,
  addressSchema,
  paginationQuerySchema
} from '@/trpc/schemas';
import { TRPCError } from '@trpc/server';

export default router({
  getAll: procedure.query(async () => {
    try {
      return await customerService.getAllCustomers();
    } catch (error) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Erro ao buscar clientes',
        cause: error
      });
    }
  }),

  getAllPaged: procedure
    .input(paginationQuerySchema)
    .query(async ({ input }) => {
      try {
        return await customerService.getAllCustomersPaged(input);
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Erro ao buscar clientes paginados',
          cause: error
        });
      }
    }),

  getByUserName: procedure.input(z.string()).query(async ({ input }) => {
    try {
      return await customerService.findCustomerByUserName(input);
    } catch (error) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Falha ao buscar o cliente pelo userName',
        cause: error
      });
    }
  }),

  getById: procedure.input(z.string()).query(async ({ input }) => {
    try {
      return await customerService.findCustomerById(input);
    } catch (error) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Falha ao buscar o cliente pelo ID',
        cause: error
      });
    }
  }),

  save: procedure.input(customerSchema).mutation(async ({ input }) => {
    try {
      return await customerService.saveCustomer(input);
    } catch (error) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Erro ao criar cliente',
        cause: error
      });
    }
  }),

  saveEndereco: procedure
    .input(z.object({ _id: z.string(), endereco: addressSchema }))
    .mutation(async ({ input }) => {
      try {
        await customerService.saveCustomerAdress(input._id, input.endereco);
        return { message: 'Endereço salvo com sucesso!' };
      } catch (error) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Erro ao salvar endereço',
          cause: error
        });
      }
    }),

  delete: procedure.input(z.string()).mutation(async ({ input }) => {
    try {
      await customerService.removeCustomerByUserName(input);
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
