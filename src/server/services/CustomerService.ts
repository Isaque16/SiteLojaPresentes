import ICustomer from "../../interfaces/ICustomer";
import Customer from "../models/CustomerModel"; // Modelo do Mongoose

export default class CustomerService {
  async getAllCustomers(): Promise<ICustomer[]> {
    try {
      const customers = await Customer.find();
      return customers as ICustomer[];
    } catch (error) {
      throw new Error(`Erro ao listar os clientes: ${error}`);
    }
  }

  async findCustomerByUserName(nomeUsuario: string): Promise<ICustomer | null> {
    try {
      const foundCustomer = await Customer.findOne({
        nomeUsuario: { $regex: nomeUsuario, $options: "i" }
      });
      return foundCustomer as ICustomer | null;
    } catch (error) {
      throw new Error(`Erro ao encontrar cliente pelo nome: ${error}`);
    }
  }

  async findCustomerById(id: string): Promise<ICustomer | null> {
    try {
      const foundCustomer = await Customer.findById(id);
      return foundCustomer;
    } catch (error) {
      throw new Error(`Erro ao encontrar cliente pelo ID: ${error}`);
    }
  }

  async saveCustomer(customerData: ICustomer): Promise<ICustomer | null> {
    try {
      if (customerData._id)
        return await Customer.findByIdAndUpdate(
          customerData._id,
          customerData,
          { new: true }
        );
      return await Customer.create(customerData);
    } catch (error) {
      throw new Error(`Erro ao salvar ou atualizar o cliente: ${error}`);
    }
  }

  async removeCustomerById(id: string): Promise<boolean> {
    try {
      const customer = await this.findCustomerById(id);
      if (!customer) return false;
      await Customer.findByIdAndDelete(id);
      return true;
    } catch (error) {
      throw new Error(`Erro ao remover cliente pelo ID: ${error}`);
    }
  }

  async removeCustomerByUserName(name: string): Promise<boolean> {
    try {
      const customer = await this.findCustomerByUserName(name);
      if (!customer) return false;
      await Customer.findOneAndDelete({ nome: name });
      return true;
    } catch (error) {
      throw new Error(`Erro ao remover cliente pelo nome: ${error}`);
    }
  }

  async checkCustomerByEmail(email: string): Promise<boolean> {
    try {
      const customer = await Customer.findOne({ email });
      return !!customer;
    } catch (error) {
      throw new Error(`Erro ao verificar cliente pelo e-mail: ${error}`);
    }
  }
}
