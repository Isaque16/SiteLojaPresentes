import ICustomer from "@/interfaces/ICustomer";
import { Schema, model, models } from "mongoose";

const customerSchema = new Schema<ICustomer>({
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
  endereco: {
    type: Object,
    trim: true,
    required: false
  }
  // purchaseHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: "Order" }],
});

export default models.Cliente || model<ICustomer>("Cliente", customerSchema);
