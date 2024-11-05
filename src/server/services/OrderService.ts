import Order from "../models/OrderModel"; // Modelo Mongoose para o Pedido
import IProduct from "../../interfaces/IProduct";
import ICustomer from "../../interfaces/ICustomer";
import IOrder from "../../interfaces/IOrder";
import connectToDatabase from "../database/connectDB";

export default class OrderService {
  constructor() {
    connectToDatabase();
  }

  // Cria um novo pedido e o salva no banco de dados
  async createOrder(
    products: IProduct[],
    customer: ICustomer,
    deliveryAddress: string,
    paymentMethod: string,
    shippingMethod: string
  ) {
    const newOrder = new Order({
      customer,
      products,
      deliveryAddress,
      paymentMethod,
      shippingMethod
    });
    return await newOrder.save();
  }

  // Lista todos os pedidos
  async listAll(): Promise<IOrder[]> {
    return await Order.find();
  }

  // Busca um pedido pelo ID
  async findById(id: string): Promise<IOrder | null> {
    return await Order.findById(id);
  }

  // Adiciona um desconto a um pedido
  async applyDiscount(
    orderId: string,
    discount: number
  ): Promise<IOrder | null> {
    return await Order.findByIdAndUpdate(orderId, { discount }, { new: true });
  }

  // Define a data de entrega do pedido
  async setDeliveryDate(
    orderId: string,
    deliveryDate: Date
  ): Promise<IOrder | null> {
    return await Order.findByIdAndUpdate(
      orderId,
      { deliveryDate },
      { new: true }
    );
  }

  // Atualiza o status de um pedido
  async updateStatus(orderId: string, status: string): Promise<IOrder | null> {
    return await Order.findByIdAndUpdate(orderId, { status }, { new: true });
  }

  // Define o custo de envio e recalcula o valor total
  async updateShippingCost(orderId: string, shippingCost: number) {
    const updatedOrder = await Order.findById(orderId);
    if (updatedOrder) {
      updatedOrder.custoEnvio = shippingCost;
      return await updatedOrder.save();
    }
    return null;
  }

  // Remove um pedido pelo ID
  async delete(orderId: string): Promise<boolean> {
    const result = await Order.findByIdAndDelete(orderId);
    return result !== null;
  }
}
