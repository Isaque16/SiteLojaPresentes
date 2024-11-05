"use server";
import { NextResponse } from "next/server";
import CustomerService from "@/server/services/CustomerService";

const customerService = new CustomerService();

export async function GET(
  request: Request,
  { params }: { params: { nome: string } }
) {
  const nome = decodeURIComponent(params.nome);
  const customer = await customerService.findByName(nome);
  console.log(customer);
  if (customer.length === 0) return NextResponse.json({ status: 404 });
  return NextResponse.json({ status: 200 });
}

export async function DELETE(
  request: Request,
  { params }: { params: { nome: string } }
) {
  await customerService.remove(params.nome);
  return NextResponse.json({ message: "Usuário removido com sucesso" });
}
