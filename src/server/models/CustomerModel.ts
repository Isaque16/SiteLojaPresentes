import mongoose from "mongoose";

const customerSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, trim: true },
  phone: { type: String, required: true, trim: true },
  adress: { type: String, required: true, trim: true },
  purchaseHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: "Order" }],
});

const Customer = mongoose.model("Customer", customerSchema);
export default Customer;
