import mongoose from "mongoose";

const customerSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  senha: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    trim: true
  },
  telefone: {
    type: String,
    required: true,
    trim: true
  },
  CEP: {
    type: String,
    trim: true
  }
  // purchaseHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: "Order" }],
});

const Customer =
  mongoose.models.Cliente || mongoose.model("Cliente", customerSchema);
export default Customer;
