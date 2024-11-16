import IOrder from "@/interfaces/IOrder";
import connectToDatabase from "@/server/database/connectDB";
import { createOrder } from "@/server/services/OrderService";
import { NextResponse } from "next/server";

connectToDatabase();

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
