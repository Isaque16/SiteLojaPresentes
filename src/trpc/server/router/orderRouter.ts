import {
  createOrder,
  findOrderById,
  getAllOrders,
  removeOrderById,
  updateOrderStatus
} from "@/server/services/OrderService";
import { router, procedure } from "../trpc";
import { z } from "zod";
import orderSchema from "@/trpc/schemas/orderSchema";
import statusEnum from "@/trpc/schemas/statusEnum";
import { TRPCError } from "@trpc/server";

export const orderRouter = router({
  getAll: procedure.query(async () => {
    try {
      return await getAllOrders();
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Erro ao buscar pedidos",
        cause: error
      });
    }
  }),

  getById: procedure.input(z.string()).query(async ({ input }) => {
    try {
      return await findOrderById(input);
    } catch (error) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Falha ao buscar o pedido",
        cause: error
      });
    }
  }),

  save: procedure.input(orderSchema).mutation(async ({ input }) => {
    try {
      return await createOrder(input);
    } catch (error) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Erro ao criar pedido",
        cause: error
      });
    }
  }),

  updateStatus: procedure
    .input(z.object({ orderId: z.string(), updatedStatus: statusEnum }))
    .mutation(async ({ input }) => {
      try {
        await updateOrderStatus(input.orderId, input.updatedStatus);
        return { message: "Status atualizado com sucesso!" };
      } catch (error) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Erro ao atualizar o status do pedido",
          cause: error
        });
      }
    }),

  delete: procedure.input(z.string()).mutation(async ({ input }) => {
    try {
      await removeOrderById(input);
      return { message: "Pedido removido com sucesso!" };
    } catch (error) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Erro ao remover pedido",
        cause: error
      });
    }
  })
});
