import mongoose from "mongoose";

const customerSchema = new mongoose.Schema({
  nomeCompleto: {
    type: String,
    trim: true,
    required: true
  },
  nomeUsuario: {
    type: String,
    trim: true,
    required: true,
    unique: true
  },
  senha: {
    type: String,
    required: true
  },
  email: {
    type: String,
    trim: true,
    required: true
  },
  telefone: {
    type: String,
    trim: true,
    required: true
  },
  CEP: {
    type: String,
    trim: true,
    required: false
  }
  // purchaseHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: "Order" }],
});

const Customer =
  mongoose.models.Cliente || mongoose.model("Cliente", customerSchema);
export default Customer;
