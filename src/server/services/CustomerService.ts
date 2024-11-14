import ICustomer from "../../interfaces/ICustomer";
import Customer from "../models/CustomerModel"; // Modelo do Mongoose

export async function getAllCustomers(): Promise<ICustomer[]> {
  try {
    const customers: ICustomer[] = await Customer.find();
    return customers;
  } catch (error) {
    throw new Error(`Erro ao listar os clientes: ${error}`);
  }
}

export async function findCustomerByUserName(
  nomeUsuario: string
): Promise<ICustomer | null> {
  try {
    const foundCustomer: ICustomer | null = await Customer.findOne({
      nomeUsuario: { $regex: nomeUsuario, $options: "i" }
    });
    return foundCustomer;
  } catch (error) {
    throw new Error(`Erro ao encontrar cliente pelo nome: ${error}`);
  }
}

export async function findCustomerById(id: string): Promise<ICustomer | null> {
  try {
    const foundCustomer: ICustomer | null = await Customer.findById(id);
    return foundCustomer;
  } catch (error) {
    throw new Error(`Erro ao encontrar cliente pelo ID: ${error}`);
  }
}

export async function saveCustomer(
  customerData: ICustomer
): Promise<ICustomer | null> {
  let savedCustomer: ICustomer | null;
  try {
    if (customerData._id)
      savedCustomer = await Customer.findByIdAndUpdate(
        customerData._id,
        customerData,
        {
          new: true
        }
      );
    else savedCustomer = await Customer.create(customerData);
    return savedCustomer;
  } catch (error) {
    throw new Error(`Erro ao salvar ou atualizar o cliente: ${error}`);
  }
}

export async function removeCustomerById(id: string): Promise<boolean> {
  try {
    const removedCustomer: ICustomer | null = await Customer.findByIdAndDelete(
      id
    );
    return removedCustomer != null;
  } catch (error) {
    throw new Error(`Erro ao remover cliente pelo ID: ${error}`);
  }
}

export async function removeCustomerByUserName(name: string): Promise<boolean> {
  try {
    const customer: ICustomer | null = await Customer.findOneAndDelete({
      nome: name
    });
    return customer != null;
  } catch (error) {
    throw new Error(`Erro ao remover cliente pelo nome: ${error}`);
  }
}

export async function checkCustomerByEmail(email: string): Promise<boolean> {
  try {
    const customer: ICustomer | null = await Customer.findOne({ email });
    return !!customer;
  } catch (error) {
    throw new Error(`Erro ao verificar cliente pelo e-mail: ${error}`);
  }
}
