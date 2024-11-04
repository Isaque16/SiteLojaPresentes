"use server";
import ProductService from "@/server/services/ProductService";
import { NextResponse } from "next/server";

const productService = new ProductService();

export async function GET() {
  const products = await productService.listAll();
  return NextResponse.json(products, { status: 200 });
}

export async function POST(request: Request) {
  const productData = await request.json();
  try {
    productService.save(productData);
    return NextResponse.json(
      { message: "Produto criado com sucesso!" },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json(
      { message: `Erro ao criar produto: ${error}` },
      { status: 500 },
    );
  }
}

export async function PUT(request: Request) {
  const productData = await request.json();
  await productService.save(productData);
  return NextResponse.json(
    { message: "Produto atualizado com sucesso!" },
    { status: 200 },
  );
}
