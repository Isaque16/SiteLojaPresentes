"use server";
import Order from "../models/OrderModel";
import IOrder from "../../interfaces/IOrder";
import EStatus from "@/interfaces/EStatus";
import Customer from "../models/CustomerModel";
import Product from "../models/ProductModel";
import IProduct from "@/interfaces/IProduct";

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
    const foundOrder: IOrder | null = await Order.findById(id)
      .populate("cliente", "nomeCompleto")
      .populate("cesta");
    return foundOrder;
  } catch (error) {
    console.error("Erro ao buscar pedido:", error);
    throw error;
  }
}

// Funções para criar um pedido
async function saveOrder(order: IOrder): Promise<IOrder> {
  return await Order.create(order);
}

async function updateCustomerHistory(
  customerId: string,
  order: IOrder
): Promise<void> {
  await Customer.findByIdAndUpdate(
    customerId,
    { $push: { historicoDeCompras: order } },
    { new: true }
  );
}

async function updateProductInventory(
  products: IProduct[],
  quantities: number[]
): Promise<void> {
  const updatePromises = products.map((prod, index) =>
    Product.findByIdAndUpdate(prod._id, {
      $inc: { quantidade: -quantities[index] }
    })
  );
  await Promise.all(updatePromises);
}

async function getOrderDetails(orderId: string): Promise<IOrder | null> {
  return await findOrderById(orderId);
}

export async function createOrder(order: IOrder) {
  try {
    const createdOrder = await saveOrder(order);

    await Promise.all([
      updateCustomerHistory(order.cliente._id!, createdOrder),
      updateProductInventory(order.cesta, order.quantidades)
    ]);

    return await getOrderDetails(createdOrder._id!);
  } catch (error) {
    console.error("Erro ao criar pedido:", error);
    throw error;
  }
}

// Criar uma função para criar um novo CUPOM

export async function updateOrderStatus(
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
