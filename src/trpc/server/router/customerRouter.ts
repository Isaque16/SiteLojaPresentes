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

export const customerRouter = router({
  getAll: procedure.query(async () => {
    try {
      const customers = await getAllCustomers();
      return customers;
    } catch (error) {
      console.error("Error fetching customers:", error);
      throw new Error("Failed to fetch customers");
    }
  }),
  getByName: procedure.input(z.string()).query(async ({ input }) => {
    try {
      const foundCustomer = await findCustomerByUserName(input);
      return foundCustomer;
    } catch (error) {
      console.error("Erro ao buscar cliente:", error);
      throw new Error("Falha ao buscar o cliente");
    }
  }),
  getById: procedure.input(z.string()).query(async ({ input }) => {
    try {
      const foundCustomer = await findCustomerById(input);
      return foundCustomer;
    } catch (error) {
      console.error("Erro ao buscar cliente:", error);
      throw new Error("Falha ao buscar o cliente");
    }
  }),
  save: procedure.input(customerSchema).mutation(async ({ input }) => {
    try {
      const savedCustomer = await saveCustomer(input);
      return savedCustomer;
    } catch (error) {
      console.error("Erro ao salvar o cliente:", error);
      throw new Error("Erro ao criar cliente");
    }
  }),
  saveEndereco: procedure
    .input(z.object({ _id: z.string(), endereco: addressSchema }))
    .mutation(async ({ input }) => {
      try {
        await saveCustomerAdress(input._id, input.endereco);
        return { message: "Endereço salvo com sucesso" };
      } catch (err) {
        console.error(err);
        return { message: "Erro ao salvar endereco" };
      }
    }),
  delete: procedure.input(z.string()).mutation(async ({ input }) => {
    try {
      await removeCustomerByUserName(input);
      return { message: "Cliente removido com sucesso!" };
    } catch (error) {
      console.error(error);
      return { message: "Erro ao remover cliente" };
    }
  })
});

export type CustomerRouter = typeof customerRouter;
