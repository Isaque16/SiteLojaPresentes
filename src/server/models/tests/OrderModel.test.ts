import Order from "../../models/OrderModel";
import Product from "../../models/ProductModel";
import Customer from "../../models/CustomerModel";

describe("Order Model", () => {
  let customer: Customer;
  let products: Product[];
  let order: Order;

  beforeEach(() => {
    // Configuração dos dados de teste
    customer = new Customer("Customer Test", "test@example.com", "123456789", "Test Address");
    products = [
      new Product("Product 1", "Category 1", 100, 1, "Description 1", "/image1.png"),
      new Product("Product 2", "Category 2", 200, 2, "Description 2", "/image2.png"),
    ];

    order = new Order(customer, products, "Delivery Address", "Credit Card", "Express");
  });

  test("should create an order with default values", () => {
    expect(order.id).toBeDefined();
    expect(order.customer).toBe(customer);
    expect(order.products).toEqual(products);
    expect(order.status).toBe("Processando");
    expect(order.deliveryAddress).toBe("Delivery Address");
    expect(order.paymentMethod).toBe("Credit Card");
    expect(order.shippingMethod).toBe("Express");
    expect(order.totalValue).toBe(300); // Products total without discount or shipping cost
  });

  test("should calculate the total value with shipping cost and discount", () => {
    order.shippingCost = 50;
    order.discount = 25;
    expect(order.totalValue).toBe(325); // 300 + 50 - 25
  });

  test("should update products and recalculate total value", () => {
    const newProducts = [
      new Product("Product 3", "Category 3", 150, 1, "Description 3", "/image3.png"),
    ];
    order.products = newProducts;
    expect(order.products).toEqual(newProducts);
    expect(order.totalValue).toBe(150); // New product price
  });

  test("should update order status", () => {
    order.status = "Shipped";
    expect(order.status).toBe("Shipped");
  });

  test("should set and retrieve delivery date", () => {
    const deliveryDate = new Date();
    order.deliveryDate = deliveryDate;
    expect(order.deliveryDate).toEqual(deliveryDate);
  });

  test("should update shipping cost and recalculate total value", () => {
    order.shippingCost = 20;
    expect(order.shippingCost).toBe(20);
    expect(order.totalValue).toBe(320); // 300 + 20
  });

  test("should apply discount and recalculate total value", () => {
    order.discount = 10;
    expect(order.discount).toBe(10);
    expect(order.totalValue).toBe(290); // 300 - 10
  });

  test("should update payment method", () => {
    order.paymentMethod = "Bank Slip";
    expect(order.paymentMethod).toBe("Bank Slip");
  });

  test("should update shipping method", () => {
    order.shippingMethod = "Standard";
    expect(order.shippingMethod).toBe("Standard");
  });

  test("should add notes to the order", () => {
    order.notes = "Handle with care";
    expect(order.notes).toBe("Handle with care");
  });
});
