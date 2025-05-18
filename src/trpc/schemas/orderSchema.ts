import customerSchema from './customerSchema';
import productSchema from './productSchema';
import addressSchema from './addressSchema';
import formaPagamentoEnum from './paymentMethodEnum';
import statusEnum from './statusEnum';
import * as v from 'valibot';

export default v.object({
  _id: v.optional(v.string()),
  cliente: v.omit(customerSchema, ['senha']),
  cesta: v.array(productSchema),
  quantidades: v.array(v.number()),
  subTotal: v.number(),
  valorFrete: v.optional(v.number()),
  valorTotal: v.number(),
  formaPagamento: formaPagamentoEnum,
  status: statusEnum,
  desconto: v.optional(v.number()),
  metodoEnvio: v.optional(v.string()),
  enderecoEntrega: v.optional(addressSchema),
  dataPedido: v.pipe(
    v.union([v.date(), v.string()]),
    v.transform((val) => typeof val === 'string' ? new Date(val) : val)
  ),
  dataEntrega: v.optional(
    v.pipe(
      v.union([v.date(), v.string()]),
      v.transform((val) => typeof val === 'string' ? new Date(val) : val)
    )
  )
})
