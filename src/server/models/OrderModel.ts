import { EFormaPagamento, EStatus } from "@/interfaces/IOrder";
import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  cliente: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Cliente",
    required: true
  },
  cesta: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Produto",
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
    type: String,
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

const Order = mongoose.models.Pedido || mongoose.model("Pedido", orderSchema);
export default Order;
