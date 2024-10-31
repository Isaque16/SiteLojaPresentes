import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  nome: { type: String, required: true, trim: true },
  categoria: { type: String, required: true, trim: true },
  preco: { type: Number, required: true, min: 0 },
  quantidade: { type: Number, required: true, default: 0, min: 0 },
  descricao: { type: String, required: true, trim: true },
  imagem: { type: String },
  nomeImagem: { type: String },
});

const Product = mongoose.model("Produto", productSchema);
export default Product;
