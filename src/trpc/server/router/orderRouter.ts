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

export const orderRouter = router({
  getAll: procedure.query(async () => {
    try {
      const orders = await getAllOrders();
      return orders;
    } catch (error) {
      console.error("Error fetching orders:", error);
      throw new Error("Failed to fetch orders");
    }
  }),
  getById: procedure.input(z.string()).query(async ({ input }) => {
    try {
      const foundOrder = await findOrderById(input);
      if (!foundOrder) throw new Error("Pedido não encontrado");
      return foundOrder;
    } catch (error) {
      console.error("Erro ao buscar pedido:", error);
      throw new Error("Falha ao buscar o pedido");
    }
  }),
  save: procedure.input(orderSchema).mutation(async ({ input }) => {
    try {
      const createdOrder = await createOrder(input);
      return createdOrder;
    } catch (error) {
      console.error("Erro ao salvar o pedido:", error);
      throw new Error("Erro ao criar pedido");
    }
  }),
  updateStatus: procedure
    .input(z.object({ orderId: z.string(), updatedStatus: statusEnum }))
    .mutation(async ({ input }) => {
      await updateOrderStatus(input.orderId, input.updatedStatus);
      return { message: "Status atualizado com sucesso!" };
    }),
  delete: procedure.input(z.string()).mutation(async ({ input }) => {
    try {
      await removeOrderById(input);
      return { message: "Pedido removido com sucesso!" };
    } catch (error) {
      console.error(error);
      return { message: "Erro ao remover pedido" };
    }
  })
});

export type OrderRouter = typeof orderRouter;
