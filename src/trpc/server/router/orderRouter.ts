import {
  createOrder,
  findOrderById,
  getAllOrders,
  removeOrderById,
  updateOrderStatus
} from "../services";
import { router, procedure } from "../trpc";
import { statusSchema, orderSchema } from "@/trpc/schemas";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

/**
 * Order Router - Handles all order-related API endpoints
 */
export default router({
  /**
   * Retrieves all orders from the database
   *
   * @returns {Promise<IOrder[]>} Array of all orders
   * @throws {TRPCError} With code 'INTERNAL_SERVER_ERROR' if fetching fails
   */
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

  /**
   * Finds an order by its ID
   *
   * @param {string} input - The order ID to search for
   * @returns {Promise<IOrder>} The found order object
   * @throws {TRPCError} With code 'NOT_FOUND' if order doesn't exist
   */
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

  /**
   * Creates a new order in the database
   *
   * @param {object} input - The order data validated by orderSchema
   * @returns {Promise<IOrder>} The created order object
   * @throws {TRPCError} With code 'BAD_REQUEST' if creation fails
   */
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

  /**
   * Updates the status of an existing order
   *
   * @param {object} input - Object containing order ID and new status
   * @param {string} input.orderId - The order ID to update
   * @param {string} input.updatedStatus - The new status from statusEnum
   * @returns {Promise<{message: string}>} Success confirmation message
   * @throws {TRPCError} With code 'BAD_REQUEST' if status update fails
   */
  updateStatus: procedure
    .input(z.object({ orderId: z.string(), updatedStatus: statusSchema }))
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

  /**
   * Removes an order from the database by its ID
   *
   * @param {string} input - The order ID to delete
   * @returns {Promise<{message: string}>} Success confirmation message
   * @throws {TRPCError} With code 'BAD_REQUEST' if deletion fails
   */
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
