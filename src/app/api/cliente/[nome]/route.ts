"use server";
import { NextResponse } from "next/server";
import connectToDatabase from "@/server/database/connectDB";
import {
  findCustomerByUserName,
  removeCustomerById
} from "@/server/services/CustomerService";

connectToDatabase();

export async function GET(
  req: Request,
  { params }: { params: { nome: string } }
) {
  try {
    const nome = decodeURIComponent(params.nome);
    const customer = await findCustomerByUserName(nome);

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
    const customer = await findCustomerByUserName(nome);

    if (!customer) {
      return NextResponse.json(
        { message: "Cliente não encontrado!" },
        { status: 404 }
      );
    }

    await removeCustomerById(nome);
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
