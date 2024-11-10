"use server";
import ICustomer from "@/interfaces/ICustomer";
import connectToDatabase from "@/server/database/connectDB";
import CustomerService from "@/server/services/CustomerService";
import { NextResponse } from "next/server";

connectToDatabase();
const service = new CustomerService();

export async function GET() {
  try {
    const customers = await service.getAllCustomers();
    return NextResponse.json(customers, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Erro ao listar clientes" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const customerData: ICustomer = await req.json();
    await service.saveCustomer(customerData);
    return NextResponse.json(
      { message: "Cliente criado com sucesso!" },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Erro ao criar cliente" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const customerData: ICustomer = await req.json();
    const existingCustomer = await service.findCustomerById(customerData._id!);
    if (!existingCustomer) {
      return NextResponse.json(
        { message: "Cliente não encontrado" },
        { status: 404 }
      );
    }

    await service.saveCustomer(customerData);
    return NextResponse.json(
      { message: "Cliente atualizado com sucesso!" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Erro ao atualizar cliente" },
      { status: 500 }
    );
  }
}
