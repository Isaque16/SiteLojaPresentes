"use server";
import ICustomer from "@/server/interfaces/ICustomer";
import CustomerService from "@/server/services/CustomerService";
import { NextResponse } from "next/server";

const customerService = new CustomerService();

export async function GET() {
  const customers = customerService.listAll();
  return NextResponse.json(customers);
}

export async function POST(request: Request) {
  const customerData: ICustomer = await request.json();
  customerService.save(customerData);
  return NextResponse.json(
    { message: "Cliente cadastrado com sucesso" },
    { status: 201 }
  );
}

export async function PUT(request: Request) {
  const customerData = await request.json();
  customerService.save(customerData);
  return NextResponse.json({ message: "Customer updated successfully" });
}
