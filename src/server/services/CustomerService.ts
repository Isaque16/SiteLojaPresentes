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

  // Insert methods

  // Adds a new customer
  add(customer: Customer): void {
    this.customers.push(customer);
  }

  // Update methods

  // Updates the information of an existing customer by ID
  update(id: string, updatedData: Partial<Customer>): void {
    const customer = this.customers.find((c) => c.id === id);
    if (customer) {
      Object.assign(customer, updatedData);
      return;
    }
    throw new Error("Customer not found.");
  }

  // Delete methods

  // Removes a customer by ID
  remove(id: string): void {
    this.customers = this.customers.filter((customer) => customer.id !== id);
  }
}