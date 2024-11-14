import Order from "../models/OrderModel";
import IProduct from "../../interfaces/IProduct";
import ICustomer from "../../interfaces/ICustomer";
import IOrder, { EStatus } from "../../interfaces/IOrder";

export async function getAllOrders(): Promise<IOrder[]> {
  try {
    const orders: IOrder[] = await Order.find();
    return orders;
  } catch (error) {
    console.error("Erro ao listar pedidos:", error);
    throw error;
  }
}

export async function findOrderById(id: string): Promise<IOrder | null> {
  try {
    const foundOrder: IOrder | null = await Order.findById(id);
    return foundOrder;
  } catch (error) {
    console.error("Erro ao buscar pedido:", error);
    throw error;
  }
}

export async function createOrder(
  products: IProduct[],
  customer: ICustomer,
  deliveryAddress: string,
  paymentMethod: string,
  shippingMethod: string
) {
  try {
    const createdOrder = await Order.create({
      customer,
      products,
      deliveryAddress,
      paymentMethod,
      shippingMethod
    });
    return createdOrder;
  } catch (error) {
    console.error("Erro ao criar pedido:", error);
    throw error;
  }
}

export async function applyDiscount(
  orderId: string,
  discount: number
): Promise<IOrder | null> {
  try {
    const updatedDiscount: IOrder | null = await Order.findByIdAndUpdate(
      orderId,
      { discount },
      { new: true }
    );
    return updatedDiscount;
  } catch (error) {
    console.error("Erro ao aplicar desconto:", error);
    throw error;
  }
}

export async function setDeliveryDate(
  orderId: string,
  deliveryDate: Date
): Promise<IOrder | null> {
  try {
    const settedDeliveryDate: IOrder | null = await Order.findByIdAndUpdate(
      orderId,
      { deliveryDate },
      { new: true }
    );
    return settedDeliveryDate;
  } catch (error) {
    console.error("Erro ao definir data de entrega:", error);
    throw error;
  }
}

export async function updateStatus(
  orderId: string,
  status: EStatus
): Promise<IOrder | null> {
  try {
    const updatedStatus: IOrder | null = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );
    return updatedStatus;
  } catch (error) {
    console.error("Erro ao atualizar status do pedido:", error);
    throw error;
  }
}

export async function updateShippingCost(
  orderId: string,
  shippingCost: number
): Promise<IOrder | null> {
  try {
    const updatedShippingCost: IOrder | null = await Order.findByIdAndUpdate(
      orderId,
      { shippingCost },
      { new: true }
    );
    return updatedShippingCost;
  } catch (error) {
    console.error("Erro ao atualizar custo de envio:", error);
    throw error;
  }
}

export async function removeOrder(orderId: string): Promise<boolean> {
  try {
    const removedOrder: IOrder | null = await Order.findByIdAndDelete(orderId);
    return removedOrder !== null;
  } catch (error) {
    console.error("Erro ao deletar pedido:", error);
    throw error;
  }
}
