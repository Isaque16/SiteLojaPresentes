import Product from "../../models/ProductModel";
import Customer from "../../models/CustomerModel";
import OrderService from "../../services/OrderService";

describe("OrderService", () => {
  let orderService: OrderService;
  let customer: Customer;
  let product1: Product;
  let product2: Product;

  beforeEach(() => {
    orderService = new OrderService();
    customer = new Customer(
      "John Doe",
      "john.doe@example.com",
      "123-456-7890",
      "123 Main St",
    );
    product1 = new Product(
      "Product 1",
      "Category 1",
      5,
      100,
      "loremisum",
      "path",
    );
    product2 = new Product(
      "Product 2",
      "Category 2",
      3,
      100,
      "loremisum",
      "path",
    );
  });

  test("should create a new order", () => {
    const order = orderService.createOrder(
      [product1, product2],
      customer,
      "123 Main St",
      "Credit Card",
      "Express",
    );
    expect(orderService.listAll().length).toBe(1);
    expect(order).toHaveProperty("id");
  });

  test("should retrieve all orders", () => {
    orderService.createOrder(
      [product1],
      customer,
      "123 Main St",
      "Credit Card",
      "Express",
    );
    orderService.createOrder(
      [product2],
      customer,
      "456 Park Ave",
      "PayPal",
      "Standard",
    );
    expect(orderService.listAll().length).toBe(2);
  });

  test("should find an order by ID", () => {
    const order = orderService.createOrder(
      [product1, product2],
      customer,
      "123 Main St",
      "Credit Card",
      "Express",
    );
    const foundOrder = orderService.findById(order.id);
    expect(foundOrder).toBe(order);
  });

  test("should return undefined for a non-existent order ID", () => {
    const foundOrder = orderService.findById("nonexistent-id");
    expect(foundOrder).toBeUndefined();
  });

  test("should apply a discount to an order", () => {
    const order = orderService.createOrder(
      [product1],
      customer,
      "123 Main St",
      "Credit Card",
      "Express",
    );
    orderService.applyDiscount(order.id, 10);
    const updatedOrder = orderService.findById(order.id);
    expect(updatedOrder!.discount).toBe(10);
  });

  test("should set the delivery date of an order", () => {
    const order = orderService.createOrder(
      [product1],
      customer,
      "123 Main St",
      "Credit Card",
      "Express",
    );
    const deliveryDate = new Date();
    orderService.setDeliveryDate(order.id, deliveryDate);
    const updatedOrder = orderService.findById(order.id);
    expect(updatedOrder!.deliveryDate).toBe(deliveryDate);
  });

  test("should update the products in an order", () => {
    const order = orderService.createOrder(
      [product1],
      customer,
      "123 Main St",
      "Credit Card",
      "Express",
    );
    orderService.updateProducts(order.id, [product2]);
    const updatedOrder = orderService.findById(order.id);
    expect(updatedOrder!.products).toEqual([product2]);
  });

  test("should update the status of an order", () => {
    const order = orderService.createOrder(
      [product1],
      customer,
      "123 Main St",
      "Credit Card",
      "Express",
    );
    orderService.updateStatus(order.id, "Shipped");
    const updatedOrder = orderService.findById(order.id);
    expect(updatedOrder!.status).toBe("Shipped");
  });

  test("should update the shipping cost of an order", () => {
    const order = orderService.createOrder(
      [product1],
      customer,
      "123 Main St",
      "Credit Card",
      "Express",
    );
    orderService.updateShippingCost(order.id, 15);
    const updatedOrder = orderService.findById(order.id);
    expect(updatedOrder!.shippingCost).toBe(15);
  });

  test("should delete an order by ID", () => {
    const order = orderService.createOrder(
      [product1],
      customer,
      "123 Main St",
      "Credit Card",
      "Express",
    );
    const deleteResult = orderService.delete(order.id);
    expect(deleteResult).toBe(true);
    expect(orderService.listAll().length).toBe(0);
  });

  test("should return false when trying to delete a non-existent order", () => {
    const deleteResult = orderService.delete("nonexistent-id");
    expect(deleteResult).toBe(false);
  });
});
