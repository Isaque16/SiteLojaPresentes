import CustomerService from "../CustomerService";
import Customer from "../../models/CustomerModel";

describe("CustomerService", () => {
  let customerService: CustomerService;
  let customer1: Customer;
  let customer2: Customer;

  beforeEach(() => {
    customerService = new CustomerService();
    customer1 = new Customer(
      "Alice",
      "alice@example.com",
      "123-456-7890",
      "123 Main St",
    );
    customer2 = new Customer(
      "Bob",
      "bob@example.com",
      "098-765-4321",
      "456 Elm St",
    );
    customerService.addCustomer(customer1);
    customerService.addCustomer(customer2);
  });

  test("should list all customers", () => {
    expect(customerService.listCustomers()).toEqual([customer1, customer2]);
  });

  test("should find customers by name", () => {
    expect(customerService.findCustomersByName("Alice")).toEqual([customer1]);
  });

  test("should find a customer by ID", () => {
    expect(customerService.findCustomerById(customer1.id)).toBe(customer1);
  });

  test("should return undefined if customer ID not found", () => {
    expect(customerService.findCustomerById("nonexistent-id")).toBeUndefined();
  });

  test("should check if a customer is already registered by email", () => {
    expect(customerService.checkCustomerByEmail("alice@example.com")).toBe(
      true,
    );
    expect(customerService.checkCustomerByEmail("unknown@example.com")).toBe(
      false,
    );
  });

  test("should add a new customer", () => {
    const newCustomer = new Customer(
      "Charlie",
      "charlie@example.com",
      "111-222-3333",
      "789 Maple St",
    );
    customerService.addCustomer(newCustomer);
    expect(customerService.listCustomers()).toContain(newCustomer);
  });

  test("should update an existing customer by ID", () => {
    customerService.updateCustomer(customer1.id, {
      name: "Alice Updated",
      phone: "123-000-0000",
    });
    const updatedCustomer = customerService.findCustomerById(customer1.id);
    expect(updatedCustomer?.name).toBe("Alice Updated");
    expect(updatedCustomer?.phone).toBe("123-000-0000");
  });

  test("should throw an error when trying to update a non-existent customer", () => {
    expect(() =>
      customerService.updateCustomer("nonexistent-id", { name: "New Name" }),
    ).toThrow("Customer not found.");
  });

  test("should remove a customer by ID", () => {
    customerService.removeCustomer(customer1.id);
    expect(customerService.listCustomers()).not.toContain(customer1);
  });

  test("should not throw an error when removing a non-existent customer", () => {
    expect(() =>
      customerService.removeCustomer("nonexistent-id"),
    ).not.toThrow();
  });
});
