"use server";
import ICustomer from "@/interfaces/ICustomer";
import CustomerService from "@/server/services/CustomerService";
import { NextResponse } from "next/server";

const service = new CustomerService();

export async function GET() {
  const customers = await service.listAll();
  return NextResponse.json(customers, { status: 200 });
}

export async function POST(req: Request) {
  const customerData: ICustomer = await req.json();
  await service.save(customerData);
  return NextResponse.json({ status: 201 });
}

export async function PUT(req: Request) {
  const customerData: ICustomer = await req.json();
  await service.save(customerData);
  return NextResponse.json({ message: "Customer updated successfully" });
}
