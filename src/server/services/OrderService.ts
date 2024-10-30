import Order from "../models/OrderModel";
import Product from "../models/ProductModel";
import Customer from "../models/CustomerModel";

export default class OrderService {
  private orders: Order[] = [];

  // Creat methods
  
  // Cria um novo pedido e o adiciona à lista de pedidos
  createOrder(
    products: Product[],
    customer: Customer,
    deliveryAddress: string,
    paymentMethod: string,
    shippingMethod: string,
  ): Order {
    const newOrder = new Order(
      customer,
      products,
      deliveryAddress,
      paymentMethod,
      shippingMethod,
    );
    this.orders.push(newOrder);
    return newOrder;
  }

  // Read methods

  // Retorna todos os pedidos para visualização geral
  listAll(): Order[] {
    return this.orders;
  }

  // Retorna um pedido pelo ID
  findById(id: string): Order | undefined {
    return this.orders.find((order) => order.id === id);
  }

  // Insert methods

  // Adiciona um desconto a um pedido
  applyDiscount(orderId: string, discount: number): Order | undefined {
    const order = this.findById(orderId);
    if (order) order.discount = discount;
    return order;
  }

  // Define a data de entrega do pedido
  setDeliveryDate(orderId: string, deliveryDate: Date): Order | undefined {
    const order = this.findById(orderId);
    if (order) order.deliveryDate = deliveryDate;
    return order;
  }

  // Update methods
  
  // Atualiza os produtos de um pedido e recalcula o valor total
  updateProducts(orderId: string, products: Product[]): Order | undefined {
    const order = this.findById(orderId);
    if (order) order.products = products;
    return order;
  }

  // Define o status de um pedido
  updateStatus(orderId: string, status: string): Order | undefined {
    const order = this.findById(orderId);
    if (order) order.status = status;
    return order;
  }

  // Define o custo de envio e recalcula o valor total do pedido
  updateShippingCost(orderId: string, shippingCost: number): Order | undefined {
    const order = this.findById(orderId);
    if (order) order.shippingCost = shippingCost;
    return order;
  }

  // Delete methods

  // Remove um pedido pelo ID
  delete(orderId: string): boolean {
    const orderIndex = this.orders.findIndex((order) => order.id === orderId);
    if (orderIndex !== -1) {
      this.orders.splice(orderIndex, 1);
      return true;
    }
    return false;
  }
}