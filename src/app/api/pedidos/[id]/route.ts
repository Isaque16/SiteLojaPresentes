"use server";
import { findOrderById } from "@/server/services/OrderService";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const order = await findOrderById((await params).id);
    if (!order)
      return NextResponse.json(
        { message: "Pedido não encontrado!" },
        { status: 404 }
      );
    return NextResponse.json(order, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Erro ao buscar pedido" },
      { status: 500 }
    );
  }
}
