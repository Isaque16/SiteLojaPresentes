import { orderService } from '../services';
import { router, publicProcedure } from '../trpc';
import {
  statusSchema,
  orderSchema,
  paginationQuerySchema
} from '@/trpc/schemas';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';

export default router({
  getAll: publicProcedure.query(async () => {
    try {
      return await orderService.getAllOrders();
    } catch (error) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Erro ao buscar pedidos',
        cause: error
      });
    }
  }),

  getAllPaged: publicProcedure
    .input(paginationQuerySchema)
    .query(async ({ input }) => {
      try {
        return await orderService.getAllOrdersPaged(input);
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Erro ao buscar pedidos',
          cause: error
        });
      }
    }),

  getById: publicProcedure.input(z.string()).query(async ({ input }) => {
    try {
      return await orderService.findOrderById(input);
    } catch (error) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Falha ao buscar o pedido',
        cause: error
      });
    }
  }),

  save: publicProcedure.input(orderSchema).mutation(async ({ input }) => {
    try {
      return await orderService.createOrder(input);
    } catch (error) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Erro ao criar pedido',
        cause: error
      });
    }
  }),

  updateStatus: publicProcedure
    .input(z.object({ orderId: z.string(), updatedStatus: statusSchema }))
    .mutation(async ({ input }) => {
      try {
        await orderService.updateOrderStatus(
          input.orderId,
          input.updatedStatus
        );
        return { message: 'Status atualizado com sucesso!' };
      } catch (error) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Erro ao atualizar o status do pedido',
          cause: error
        });
      }
    }),

  delete: publicProcedure.input(z.string()).mutation(async ({ input }) => {
    try {
      await orderService.removeOrderById(input);
      return { message: 'Pedido removido com sucesso!' };
    } catch (error) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Erro ao remover pedido',
        cause: error
      });
    }
  })
});
