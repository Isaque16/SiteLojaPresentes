import {
  findCustomerById,
  findCustomerByUserName,
  getAllCustomers,
  removeCustomerByUserName,
  saveCustomer,
  saveCustomerAdress
} from "@/server/services/CustomerService";
import { procedure, router } from "../trpc";
import { z } from "zod";
import addressSchema from "@/trpc/schemas/addressSchema";
import customerSchema from "@/trpc/schemas/customerSchema";
import { TRPCError } from "@trpc/server";

export const customerRouter = router({
  getAll: procedure.query(async () => {
    try {
      return await getAllCustomers();
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Erro ao buscar clientes",
        cause: error
      });
    }
  }),

  getByName: procedure.input(z.string()).query(async ({ input }) => {
    try {
      return await findCustomerByUserName(input);
    } catch (error) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Falha ao buscar o cliente pelo userName",
        cause: error
      });
    }
  }),

  getById: procedure.input(z.string()).query(async ({ input }) => {
    try {
      return await findCustomerById(input);
    } catch (error) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Falha ao buscar o cliente pelo ID",
        cause: error
      });
    }
  }),

  save: procedure.input(customerSchema).mutation(async ({ input }) => {
    try {
      return await saveCustomer(input);
    } catch (error) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Erro ao criar cliente",
        cause: error
      });
    }
  }),

  saveEndereco: procedure
    .input(z.object({ _id: z.string(), endereco: addressSchema }))
    .mutation(async ({ input }) => {
      try {
        await saveCustomerAdress(input._id, input.endereco);
        return { message: "Endereço salvo com sucesso!" };
      } catch (error) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Erro ao salvar endereço",
          cause: error
        });
      }
    }),

  delete: procedure.input(z.string()).mutation(async ({ input }) => {
    try {
      await removeCustomerByUserName(input);
      return { message: "Cliente removido com sucesso!" };
    } catch (error) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Erro ao remover cliente",
        cause: error
      });
    }
  })
});
