import {
  findProductById,
  getAllProducts,
  removeProductById,
  saveProduct
} from "@/server/services/ProductService";
import { router, procedure } from "../trpc";
import { z } from "zod";
import productSchema from "@/trpc/schemas/productSchema";

export const productRouter = router({
  getAll: procedure.query(async () => {
    try {
      const products = await getAllProducts();
      return products;
    } catch (error) {
      console.error("Error fetching products:", error);
      throw new Error("Failed to fetch products");
    }
  }),
  getById: procedure.input(z.string()).query(async ({ input }) => {
    try {
      const foundProduct = await findProductById(input);
      if (!foundProduct) throw new Error("Produto não encontrado");
      return foundProduct;
    } catch (error) {
      console.error("Erro ao buscar produto:", error);
      throw new Error("Falha ao buscar o produto");
    }
  }),
  save: procedure.input(productSchema).mutation(async ({ input }) => {
    try {
      await saveProduct(input);
      return { message: "Estoque atualizado com sucesso!" };
    } catch (error) {
      console.error("Erro ao salvar o produto:", error);
      throw new Error("Erro ao criar produto");
    }
  }),
  delete: procedure.input(z.string()).mutation(async ({ input }) => {
    try {
      await removeProductById(input);
      return { message: "Produto removido com sucesso!" };
    } catch (error) {
      console.error(error);
      return { message: "Erro ao remover produto" };
    }
  })
});

export type ProductRouter = typeof productRouter;
