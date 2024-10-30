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
    customerService.save(customer1);
    customerService.save(customer2);
  });

  test("should list all customers", () => {
    expect(customerService.listAll()).toEqual([customer1, customer2]);
  });

  test("should find customers by name", () => {
    expect(customerService.findByName("Alice")).toEqual([customer1]);
  });

  test("should find a customer by ID", () => {
    expect(customerService.findById(customer1.id)).toBe(customer1);
  });

  test("should return undefined if customer ID not found", () => {
    expect(customerService.findById("nonexistent-id")).toBeUndefined();
  });

  test("should check if a customer is already registered by email", () => {
    expect(customerService.checkByEmail("alice@example.com")).toBe(
      true,
    );
    expect(customerService.checkByEmail("unknown@example.com")).toBe(
      false,
    );
  });

  test("should save a new customer", () => {
    const newCustomer = new Customer(
      "Charlie",
      "charlie@example.com",
      "111-222-3333",
      "789 Maple St",
    );
    customerService.save(newCustomer);
    expect(customerService.listAll()).toContain(newCustomer);
  });

  test("should update an existing customer by ID", () => {
    customerService.save({
      name: "Alice Updated",
      phone: "123-000-0000",
    }, customer1.id);
    const updatedCustomer = customerService.findById(customer1.id);
    expect(updatedCustomer!.name).toBe("Alice Updated");
    expect(updatedCustomer!.phone).toBe("123-000-0000");
  });

  test("should remove a customer by ID", () => {
    customerService.remove(customer1.id);
    expect(customerService.listAll()).not.toContain(customer1);
  });

  test("should not throw an error when removing a non-existent customer", () => {
    expect(() =>
      customerService.remove("nonexistent-id"),
    ).not.toThrow();
  });
});