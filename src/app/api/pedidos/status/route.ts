"use server";
import EStatus from "@/interfaces/EStatus";
import { updateStatus } from "@/server/services/OrderService";
import { NextResponse } from "next/server";

export async function PUT(req: Request) {
  const {
    orderId,
    updatedStatus
  }: { orderId: string; updatedStatus: EStatus } = await req.json();
  await updateStatus(orderId, updatedStatus);
  return NextResponse.json(
    { message: "Status atualizado com sucesso!" },
    { status: 200 }
  );
}
