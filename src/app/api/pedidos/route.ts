"use server";
import IOrder from "@/interfaces/IOrder";
import connectToDatabase from "@/server/database/connectDB";
import { createOrder, getAllOrders } from "@/server/services/OrderService";
import { NextResponse } from "next/server";

connectToDatabase();

export async function GET() {
  try {
    const orders = await getAllOrders();
    return NextResponse.json(orders);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Erro ao listar pedidos" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const orderData: IOrder = await req.json();
    await createOrder(orderData);
    return NextResponse.json(
      { message: "Pedido criado com sucesso!" },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Erro ao criar pedido" },
      { status: 500 }
    );
  }
}
