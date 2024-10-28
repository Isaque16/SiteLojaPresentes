import OrderService from "../OrderService";
import Product from "../../models/ProductModel";
import Customer from "../../models/CustomerModel";

describe("OrderService", () => {
  let orderService: OrderService;
  let customer: Customer;
  let products: Product[];

  beforeEach(() => {
    orderService = new OrderService();

    // Set up customer and products for testing
    customer = new Customer("Test Customer", "email@test.com", "123456789", "Test Address");
    products = [
      new Product("Product 1", "Category 1", 100, 1, "Description 1", "/image1.png"),
      new Product("Product 2", "Category 2", 200, 2, "Description 2", "/image2.png"),
    ];
  });

  test("should create a new order", () => {
    const newOrder = orderService.createOrder(
      products,
      customer,
      "Delivery Address",
      "Credit Card",
      "Express"
    );

    expect(newOrder).toBeDefined();
    expect(orderService.getAllOrders()).toContain(newOrder);
    expect(newOrder.customer).toBe(customer);
    expect(newOrder.products).toBe(products);
  });

  test("should retrieve an order by ID", () => {
    const newOrder = orderService.createOrder(
      products,
      customer,
      "Delivery Address",
      "Credit Card",
      "Express"
    );

    const fetchedOrder = orderService.getOrderById(newOrder.id);
    expect(fetchedOrder).toEqual(newOrder);
  });

  test("should update products in an order", () => {
    const newOrder = orderService.createOrder(
      products,
      customer,
      "Delivery Address",
      "Credit Card",
      "Express"
    );

    const updatedProducts = [
      new Product("Product 3", "Category 3", 300, 1, "Description 3", "/image3.png"),
    ];
    const updatedOrder = orderService.updateOrderProducts(newOrder.id, updatedProducts);

    expect(updatedOrder?.products).toEqual(updatedProducts);
  });

  test("should update the status of an order", () => {
    const newOrder = orderService.createOrder(
      products,
      customer,
      "Delivery Address",
      "Credit Card",
      "Express"
    );

    const updatedOrder = orderService.updateOrderStatus(newOrder.id, "Shipped");
    expect(updatedOrder?.status).toBe("Shipped");
  });

  test("should apply a discount to an order", () => {
    const newOrder = orderService.createOrder(
      products,
      customer,
      "Delivery Address",
      "Credit Card",
      "Express"
    );

    const discount = 50;
    const updatedOrder = orderService.applyDiscount(newOrder.id, discount);
    expect(updatedOrder?.discount).toBe(discount);
  });

  test("should set the delivery date of an order", () => {
    const newOrder = orderService.createOrder(
      products,
      customer,
      "Delivery Address",
      "Credit Card",
      "Express"
    );

    const deliveryDate = new Date();
    const updatedOrder = orderService.setDeliveryDate(newOrder.id, deliveryDate);
    expect(updatedOrder?.deliveryDate).toEqual(deliveryDate);
  });

  test("should update the shipping cost of an order", () => {
    const newOrder = orderService.createOrder(
      products,
      customer,
      "Delivery Address",
      "Credit Card",
      "Express"
    );

    const shippingCost = 20;
    const updatedOrder = orderService.updateShippingCost(newOrder.id, shippingCost);
    expect(updatedOrder?.shippingCost).toBe(shippingCost);
  });

  test("should delete an order", () => {
    const newOrder = orderService.createOrder(
      products,
      customer,
      "Delivery Address",
      "Credit Card",
      "Express"
    );

    const isDeleted = orderService.deleteOrder(newOrder.id);
    expect(isDeleted).toBe(true);
    expect(orderService.getAllOrders()).not.toContain(newOrder);
  });

  test("should return all orders", () => {
    const order1 = orderService.createOrder(
      products,
      customer,
      "Delivery Address",
      "Credit Card",
      "Express"
    );

    const order2 = orderService.createOrder(
      products,
      customer,
      "Delivery Address 2",
      "Bank Slip",
      "Standard"
    );

    const orders = orderService.getAllOrders();
    expect(orders).toContain(order1);
    expect(orders).toContain(order2);
    expect(orders.length).toBe(2);
  });
});
