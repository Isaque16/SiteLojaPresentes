import IAddress from '@/interfaces/IAddress';
import ICustomer from '@/interfaces/ICustomer';
import { customerModel as Customer } from '@/trpc/server/models';
import bcrypt from 'bcrypt';
import { IPagedQuery, IPagedResult } from '@/interfaces';

/**
 * Retrieves all customers from the database.
 *
 * @returns {Promise<ICustomer[]>} A promise that resolves to an array of customers.
 * @throws {Error} If there's an error retrieving the customers.
 */
export async function getAllCustomers(): Promise<ICustomer[]> {
  try {
    return await Customer.find();
  } catch (error) {
    throw new Error(`Erro ao listar os clientes: ${error}`);
  }
}

/**
 * Retrieves all customers from the database with pagination and sorting.
 *
 * @param {IPagedQuery} query - The query parameters for pagination and sorting.
 * @param {number} query.page - The page number to retrieve.
 * @param {number} query.size - The number of items per page.
 * @param {string} [query.sort] - The sorting criteria (e.g., 'nomeCompleto' or '-nomeCompleto').
 * @param {string} [query.search] - The search term to filter customers by name, username, email, or phone.
 * @returns {Promise<IPagedResult<ICustomer>>} A promise that resolves to a paginated result of customers.
 * @throws {Error} If there's an error retrieving the customers.
 */
export async function getAllCustomersPaged({
  page = 1,
  size = 10,
  sort,
  search
}: IPagedQuery): Promise<IPagedResult<ICustomer>> {
  try {
    const filter = search
      ? {
          $or: [
            { nomeCompleto: { $regex: search, $options: 'i' } },
            { nomeUsuario: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } },
            { telefone: { $regex: search, $options: 'i' } }
          ]
        }
      : {};

    const sortOption: Record<string, 1 | -1> = sort
      ? { [sort.replace('-', '')]: sort.startsWith('-') ? -1 : 1 }
      : { nomeCompleto: 1 };

    const totalCount = await Customer.countDocuments(filter);

    const totalPages = Math.ceil(totalCount / size) || 1;

    const items = await Customer.find(filter)
      .sort(sortOption)
      .skip((page - 1) * size)
      .limit(size);

    return {
      items,
      page,
      size,
      totalPages,
      totalCount
    };
  } catch (error) {
    throw new Error(`Erro ao listar os clientes paginados: ${error}`);
  }
}

/**
 * Finds a customer by their username (case-insensitive).
 *
 * @param {string} nomeUsuario - The username to search for.
 * @returns {Promise<ICustomer | null>} A promise that resolves to the found customer or null if not found.
 * @throws {Error} If there's an error finding the customer.
 */
export async function findCustomerByUserName(
  nomeUsuario: string
): Promise<ICustomer | null> {
  try {
    return await Customer.findOne({
      nomeUsuario: { $regex: nomeUsuario, $options: 'i' }
    });
  } catch (error) {
    throw new Error(`Erro ao encontrar cliente pelo nome: ${error}`);
  }
}

/**
 * Finds a customer by their ID and populates their purchase history.
 *
 * @param {string} id - The ID of the customer to find.
 * @returns {Promise<ICustomer | null>} A promise that resolves to the found customer with populated history or null if not found.
 * @throws {Error} If there's an error finding the customer.
 */
export async function findCustomerById(id: string): Promise<ICustomer | null> {
  try {
    return await Customer.findById(id).populate('historicoDeCompras');
  } catch (error) {
    throw new Error(`Erro ao encontrar cliente pelo ID: ${error}`);
  }
}

/**
 * Saves a customer to the database. If the customer has an ID, it updates the existing customer;
 * otherwise, it creates a new one.
 *
 * @param {ICustomer} customerData - The customer data to save.
 * @returns {Promise<ICustomer | null>} A promise that resolves to the saved customer or null.
 * @throws {Error} If there's an error saving the customer.
 */
export async function saveCustomer(
  customerData: ICustomer
): Promise<ICustomer | null> {
  let savedCustomer: ICustomer | null;
  try {
    const hashedPassword = await bcrypt.hash(customerData.senha, 10);
    const customerDataWithHashedPassword = {
      ...customerData,
      senha: hashedPassword
    };
    if (customerData._id) {
      savedCustomer = await Customer.findByIdAndUpdate(
        customerData._id,
        customerDataWithHashedPassword,
        { new: true }
      );
    } else {
      savedCustomer = await Customer.create(customerDataWithHashedPassword);
    }
    return savedCustomer;
  } catch (error) {
    throw new Error(`Erro ao salvar ou atualizar o cliente: ${error}`);
  }
}

/**
 * Updates a customer's address by their ID.
 *
 * @param {string} customerId - The ID of the customer to update.
 * @param {IAddress} adress - The new address information.
 * @returns {Promise<ICustomer | null>} A promise that resolves to the updated customer or null.
 * @throws {Error} If there's an error updating the address.
 */
export async function saveCustomerAdress(customerId: string, adress: IAddress) {
  try {
    const foundCustomer: ICustomer | null = await Customer.findByIdAndUpdate(
      customerId,
      { endereco: adress },
      { new: true }
    );
    return foundCustomer;
  } catch (error) {
    throw new Error(`Erro ao tentar atualizar endereço: ${error}`);
  }
}

/**
 * Removes a customer by their ID.
 *
 * @param {string} id - The ID of the customer to remove.
 * @returns {Promise<boolean>} A promise that resolves to true if the customer was removed, false otherwise.
 * @throws {Error} If there's an error removing the customer.
 */
export async function removeCustomerById(id: string): Promise<boolean> {
  try {
    const removedCustomer: ICustomer | null =
      await Customer.findByIdAndDelete(id);
    return removedCustomer != null;
  } catch (error) {
    throw new Error(`Erro ao remover cliente pelo ID: ${error}`);
  }
}

/**
 * Removes a customer by their username.
 *
 * @param {string} name - The username of the customer to remove.
 * @returns {Promise<boolean>} A promise that resolves to true if the customer was removed, false otherwise.
 * @throws {Error} If there's an error removing the customer.
 */
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

/**
 * Checks if a customer with the provided email exists.
 *
 * @param {string} email - The email to check.
 * @returns {Promise<boolean>} A promise that resolves to true if a customer with the email exists, false otherwise.
 * @throws {Error} If there's an error checking for the customer.
 */
export async function checkCustomerByEmail(email: string): Promise<boolean> {
  try {
    const customer: ICustomer | null = await Customer.findOne({ email });
    return !!customer;
  } catch (error) {
    throw new Error(`Erro ao verificar cliente pelo e-mail: ${error}`);
  }
}
