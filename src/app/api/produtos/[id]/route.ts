"use server";
import ProductService from "@/server/services/ProductService";
import { NextResponse } from "next/server";

const productService = new ProductService();

export async function GET({ params }: { params: { id: string } }) {
  const { id } = params;
  const product = await productService.findById(id);
  if (!product)
    return NextResponse.json(
      { message: "Produto não encontrado!" },
      { status: 404 },
    );
  return NextResponse.json(product, { status: 200 });
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } },
) {
  const { id } = params;
  await productService.remove(id);
  return NextResponse.json(
    { message: "Produto removido com sucesso!" },
    { status: 200 },
  );
}
