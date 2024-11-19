import { z } from "zod";

export default z.object({
  _id: z.string().readonly().optional(),
  nome: z.string(),
  categoria: z.string(),
  preco: z
    .string()
    .transform((val) => Number(val))
    .or(z.number().min(1, "O preço deve ser maior que 0")),
  quantidade: z
    .string()
    .transform((val) => Number(val))
    .or(z.number().min(1, "Deve haver ao menos 1 produto")),
  descricao: z.string(),
  imagem: z.string(),
  nomeImagem: z.string()
});
