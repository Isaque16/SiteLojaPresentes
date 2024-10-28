import Customer from "../models/CustomerModel";

export default class CustomerService {
  private customers: Customer[] = []; // <- Data base of clients

  // Read methods

  // Lists all customers
  listAll(): Customer[] {
    return this.customers;
  }

  // Finds customers by name
  findByName(name: string): Customer[] {
    return this.customers.filter((customer) => customer.name.includes(name));
  }

  // Finds a specific customer by ID
  findById(id: string): Customer | undefined {
    return this.customers.find((customer) => customer.id === id);
  }

  // Checks if a customer is already registered by email
  checkByEmail(email: string): boolean {
    return this.customers.some((customer) => customer.email === email);
  }

  // Updates an existing product by ID or creates a new one
  save(customer: Partial<Customer>, id?: string ): void {
    const findCustomer = this.customers.find((prod) => prod.id === id);
    if (findCustomer) {
      Object.assign(findCustomer, customer);
      return;
    }
    this.customers.push(customer as Customer);
  }

  // Delete methods

  // Removes a customer by ID
  remove(id: string): void {
    this.customers = this.customers.filter((customer) => customer.id !== id);
  }
}