import IProduct from "@/interfaces/IProduct";
import { Schema, model, models } from "mongoose";

const productSchema = new Schema<IProduct>({
  nome: {
    type: String,
    trim: true,
    required: true
  },
  categoria: {
    type: String,
    trim: true,
    required: true
  },
  preco: {
    type: Number,
    min: 1,
    required: true
  },
  quantidade: {
    type: Number,
    default: 0,
    required: true
  },
  descricao: {
    type: String,
    trim: true,
    required: true
  },
  imagem: { type: String },
  nomeImagem: { type: String }
});

export default models.Produto || model<IProduct>("Produto", productSchema);
