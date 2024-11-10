import Order from "../models/OrderModel";
import IProduct from "../../interfaces/IProduct";
import ICustomer from "../../interfaces/ICustomer";
import IOrder from "../../interfaces/IOrder";

export default class OrderService {
  async getAllOrders(): Promise<IOrder[]> {
    try {
      return await Order.find();
    } catch (error) {
      console.error("Erro ao listar pedidos:", error);
      throw error;
    }
  }

  async findOrderById(id: string): Promise<IOrder | null> {
    try {
      return await Order.findById(id);
    } catch (error) {
      console.error("Erro ao buscar pedido:", error);
      throw error;
    }
  }

  async createOrder(
    products: IProduct[],
    customer: ICustomer,
    deliveryAddress: string,
    paymentMethod: string,
    shippingMethod: string
  ) {
    try {
      return await Order.create({
        customer,
        products,
        deliveryAddress,
        paymentMethod,
        shippingMethod
      });
    } catch (error) {
      console.error("Erro ao criar pedido:", error);
      throw error;
    }
  }

  async applyDiscount(
    orderId: string,
    discount: number
  ): Promise<IOrder | null> {
    try {
      return await Order.findByIdAndUpdate(
        orderId,
        { discount },
        { new: true }
      );
    } catch (error) {
      console.error("Erro ao aplicar desconto:", error);
      throw error;
    }
  }

  async setDeliveryDate(
    orderId: string,
    deliveryDate: Date
  ): Promise<IOrder | null> {
    try {
      return await Order.findByIdAndUpdate(
        orderId,
        { deliveryDate },
        { new: true }
      );
    } catch (error) {
      console.error("Erro ao definir data de entrega:", error);
      throw error;
    }
  }

  async updateStatus(orderId: string, status: string): Promise<IOrder | null> {
    try {
      return await Order.findByIdAndUpdate(orderId, { status }, { new: true });
    } catch (error) {
      console.error("Erro ao atualizar status do pedido:", error);
      throw error;
    }
  }

  async updateShippingCost(orderId: string, shippingCost: number) {
    try {
      const order = await Order.findById(orderId);
      if (order) {
        order.custoEnvio = shippingCost;
        return await order.save();
      }
      return null;
    } catch (error) {
      console.error("Erro ao atualizar custo de envio:", error);
      throw error;
    }
  }

  async removeOrder(orderId: string): Promise<boolean> {
    try {
      const result = await Order.findByIdAndDelete(orderId);
      return result !== null;
    } catch (error) {
      console.error("Erro ao deletar pedido:", error);
      throw error;
    }
  }
}
