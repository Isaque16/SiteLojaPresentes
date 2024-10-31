import connectToDatabase from "../database/connectDB";
import ICustomer from "../interfaces/ICustomer";
import Customer from "../models/CustomerModel"; // Modelo do Mongoose

export default class CustomerService {
  constructor() {
    connectToDatabase();
  }

  // Lista todos os clientes do banco de dados
  async listAll(): Promise<ICustomer[]> {
    return await Customer.find();
  }

  // Busca clientes pelo nome
  async findByName(name: string): Promise<ICustomer[]> {
    return await Customer.find({ name: { $regex: name, $options: "i" } }); // Busca parcial, case-insensitive
  }

  // Busca um cliente específico pelo ID
  async findById(id: string): Promise<ICustomer | null> {
    return await Customer.findById(id);
  }

  // Verifica se um cliente já está cadastrado pelo email
  async checkByEmail(email: string): Promise<boolean> {
    const customer = await Customer.findOne({ email });
    return !!customer;
  }

  // Atualiza um cliente existente pelo ID ou cria um novo
  async save(customerData: ICustomer | Partial<ICustomer>, id?: string) {
    if (id)
      return await Customer.findByIdAndUpdate(id, customerData, {
        new: true,
        upsert: true,
      });
    const newCustomer = new Customer(customerData);
    return await newCustomer.save();
  }

  // Remove um cliente pelo ID
  async remove(id: string): Promise<void> {
    await Customer.findByIdAndDelete(id);
  }
}
