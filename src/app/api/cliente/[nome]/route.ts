"use server";
import { NextResponse } from "next/server";
import CustomerService from "@/server/services/CustomerService";
import connectToDatabase from "@/server/database/connectDB";

connectToDatabase();
const service = new CustomerService();

export async function GET(
  req: Request,
  { params }: { params: { nome: string } }
) {
  try {
    const nome = decodeURIComponent(params.nome);
    const customer = await service.findCustomerByName(nome);

    return NextResponse.json(customer, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Erro ao buscar o cliente" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { nome: string } }
) {
  try {
    const nome = decodeURIComponent(params.nome);
    const customer = await service.findCustomerByName(nome);

    if (!customer) {
      return NextResponse.json(
        { message: "Cliente não encontrado!" },
        { status: 404 }
      );
    }

    await service.removeCustomerById(nome);
    return NextResponse.json(
      { message: "Usuário removido com sucesso" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Erro ao remover o cliente" },
      { status: 500 }
    );
  }
}
