"use server";
import { NextResponse } from "next/server";
import CustomerService from "@/server/services/CustomerService";

const service = new CustomerService();

export async function GET(
  req: Request,
  { params }: { params: { nome: string } }
) {
  const nome = decodeURIComponent(params.nome);
  const customer = await service.findByName(nome);
  return NextResponse.json(customer, { status: 200 });
}

export async function DELETE(
  req: Request,
  { params }: { params: { nome: string } }
) {
  await service.remove(params.nome);
  return NextResponse.json({ message: "Usuário removido com sucesso" });
}
