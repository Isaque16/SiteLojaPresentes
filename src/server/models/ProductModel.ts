import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  nome: {
    type: String,
    trim: true,
    required: true,
  },
  categoria: {
    type: String,
    trim: true,
    required: true,
  },
  preco: {
    type: Number,
    min: 1,
    required: true,
  },
  quantidade: {
    type: Number,
    min: 1,
    default: 0,
    required: true,
  },
  descricao: {
    type: String,
    trim: true,
    required: true,
  },
  imagem: { type: String },
  nomeImagem: { type: String },
});

const Product = mongoose.model("Produto", productSchema);
export default Product;
