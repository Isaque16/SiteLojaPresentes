import connectToDatabase from "@/server/database/connectDB";
import { getAllProducts, saveProduct } from "@/server/services/ProductService";
import productSchema from "../schemas/productSchema";
import { publicProcedure, router } from "./trpc";

connectToDatabase();

export const productRouter = router({
  // GET produtos
  getAll: publicProcedure.query(async () => {
    try {
      const products = await getAllProducts();
      return products;
    } catch (err) {
      console.error(err);
      console.error("Erro ao listar produtos");
    }
  }),
  // POST - Criar produto
  create: publicProcedure
    .input(productSchema.omit({ _id: true }))
    .mutation(async ({ input }) => {
      try {
        await saveProduct(input);
        return { message: "Produto criado com sucesso!" };
      } catch (error) {
        console.error(error);
        throw new Error("Erro ao criar produto");
      }
    }),

  update: publicProcedure.input(productSchema).mutation(async ({ input }) => {
    try {
      await saveProduct(input);
      return { message: "Produto atualizado com sucesso!" };
    } catch (error) {
      console.error(error);
      throw new Error("Erro ao atualizar produto");
    }
  })
});

export type ProductRouter = typeof productRouter;
