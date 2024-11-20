import { z } from "zod";
import customerSchema from "./customerSchema";
import productSchema from "./productSchema";
import addressSchema from "./addressSchema";
import formaPagamentoEnum from "./formaPagamentoEnum";
import statusEnum from "./statusEnum";

export default z.object({
  _id: z.string().optional(),
  cliente: customerSchema.omit({ senha: true }),
  cesta: z.array(productSchema),
  subTotal: z.number(),
  valorFrete: z.number().optional(),
  valorTotal: z.number(),
  formaPagamento: formaPagamentoEnum,
  status: statusEnum,
  desconto: z.number().optional(),
  metodoEnvio: z.string().optional(),
  enderecoEntrega: addressSchema.optional(),
  dataPedido: z
    .union([z.string(), z.date()]) // Aceita string ou Date
    .transform((val) => (typeof val === "string" ? new Date(val) : val)), // Converte string para Date
  dataEntrega: z
    .union([z.string(), z.date()]) // Opcional, mas com o mesmo tratamento
    .transform((val) => (typeof val === "string" ? new Date(val) : val))
    .optional()
});