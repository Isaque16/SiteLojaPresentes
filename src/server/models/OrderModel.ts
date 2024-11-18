import IOrder from "@/interfaces/IOrder";
import { Schema, model, models } from "mongoose";
import Cliente from "./CustomerModel";
import Produto from "./ProductModel";
import EFormaPagamento from "@/interfaces/EFormaPagamento";
import EStatus from "@/interfaces/EStatus";

const orderSchema = new Schema<IOrder>({
  cliente: {
    type: Schema.Types.ObjectId,
    ref: Cliente,
    required: true
  },
  cesta: [
    {
      type: Schema.Types.ObjectId,
      ref: Produto,
      required: true
    }
  ],
  subTotal: {
    type: Number,
    required: true,
    default: 0.0
  },
  valorFrete: {
    type: Number,
    default: 0.0,
    required: false
  },
  valorTotal: {
    type: Number,
    required: true,
    default: 0.0
  },
  formaPagamento: {
    type: String,
    trim: true,
    required: true,
    default: EFormaPagamento.pix
  },
  status: {
    type: String,
    trim: true,
    required: true,
    default: EStatus.PENDENTE
  },
  desconto: {
    type: Number,
    default: 0.0,
    required: false
  },
  metodoEnvio: {
    type: String,
    trim: true,
    required: false
  },
  enderecoEntrega: {
    type: Object,
    trim: true,
    required: false
  },
  dataEntrega: { type: Date, required: false },
  dataPedido: {
    type: Date,
    required: true,
    default: Date.now
  }
});

export default models.Pedido || model<IOrder>("Pedido", orderSchema);
