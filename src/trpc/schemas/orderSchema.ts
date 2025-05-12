import { z } from "zod";
import customerSchema from "./customerSchema";
import productSchema from "./productSchema";
import addressSchema from "./addressSchema";
import formaPagamentoEnum from "./paymentMethodEnum";
import statusEnum from "./statusEnum";

export default z.object({
  _id: z.string().optional(),
  cliente: customerSchema.omit({ senha: true }),
  cesta: z.array(productSchema),
  quantidades: z.array(z.number()),
  subTotal: z.number(),
  valorFrete: z.number().optional(),
  valorTotal: z.number(),
  formaPagamento: formaPagamentoEnum,
  status: statusEnum,
  desconto: z.number().optional(),
  metodoEnvio: z.string().optional(),
  enderecoEntrega: addressSchema.optional(),
  dataPedido: z
    .union([z.date(), z.string()])
    .transform((val) => (typeof val === "string" ? new Date(val) : val)),
  dataEntrega: z
    .union([z.date(), z.string()])
    .transform((val) => (typeof val === "string" ? new Date(val) : val))
    .optional()
});
