"use server";
import { NextResponse } from "next/server";
import ProductService from "../../../server/services/ProductService";
import IProduct from "@/interfaces/IProduct";

const service = new ProductService();

export async function GET() {
  const products = await service.listAll();
  return NextResponse.json(products, { status: 200 });
}

export async function POST(req: Request) {
  const productData: IProduct = await req.json();
  try {
    await service.save(productData);
    return NextResponse.json(
      { message: "Produto criado com sucesso!" },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: `Erro ao criar produto: ${error}` },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  const productData: IProduct = await req.json();
  await service.save(productData);
  return NextResponse.json(
    { message: "Produto atualizado com sucesso!" },
    { status: 200 }
  );
}
