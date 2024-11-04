"use server";
import { NextResponse } from "next/server";
import CustomerService from "@/server/services/CustomerService";

const customerService = new CustomerService();

export async function GET(
  request: Request,
  { params }: { params: { nome: string } }
) {
  const customer = customerService.findByName(params.nome);
  if (!customer)
    return NextResponse.json(
      { message: "Usuário não encontrado!" },
      { status: 404 }
    );
  return NextResponse.json(customer, { status: 200 });
}

export async function DELETE(
  request: Request,
  { params }: { params: { nome: string } }
) {
  customerService.remove(params.nome);
  return NextResponse.json({ message: "Customer removed successfully" });
}
