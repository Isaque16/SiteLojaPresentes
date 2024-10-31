import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
    required: true,
  },
  product: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  ],
  valorTotal: { type: Number, default: 0.0 },
  status: { type: String, default: "Processando...", trim: true },
  dataPedido: { type: Date, default: Date.now },
  dataEntrega: { type: Date },
  enderecoEntrega: { type: String, required: true, trim: true },
  metodoPagamento: { type: String, required: true, trim: true },
  custoEnvio: { type: Number, default: 0.0 },
  desconto: { type: Number, default: 0.0 },
  metodoEnvio: { type: String, required: true, trim: true },
  observacoes: { type: String, trim: true },
});

const Order = mongoose.model("Order", orderSchema);
export default Order;
