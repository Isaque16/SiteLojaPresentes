"use server";
import Order from "../models/OrderModel";
import IOrder from "../../interfaces/IOrder";
import EStatus from "@/interfaces/EStatus";

export async function getAllOrders(): Promise<IOrder[]> {
  try {
    const orders: IOrder[] = await Order.find()
      .populate("cliente", "nomeCompleto")
      .populate("cesta");
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

export async function createOrder(order: IOrder) {
  try {
    const createdOrder = await Order.create(order);
    return createdOrder;
  } catch (error) {
    console.error("Erro ao criar pedido:", error);
    throw error;
  }
}

// Criar uma função para criar um novo CUPOM

export async function updateStatus(
  orderId: string,
  updatedStatus: EStatus
): Promise<IOrder | null> {
  if (updatedStatus == EStatus.ENTREGUE) {
    await removeOrderById(orderId);
    return null;
  }
  try {
    const foundUpdatedStatus: IOrder | null = await Order.findByIdAndUpdate(
      orderId,
      { status: updatedStatus },
      { new: true }
    );
    return foundUpdatedStatus;
  } catch (error) {
    console.error("Erro ao atualizar status do pedido:", error);
    throw error;
  }
}

export async function removeOrderById(orderId: string): Promise<boolean> {
  try {
    const removedOrder: IOrder | null = await Order.findByIdAndDelete(orderId);
    return removedOrder !== null;
  } catch (error) {
    console.error("Erro ao deletar pedido:", error);
    throw error;
  }
}
