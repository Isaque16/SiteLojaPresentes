"use server";
import ProductService from "@/server/services/ProductService";
import { NextResponse } from "next/server";

const service = new ProductService();

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const product = await service.findById(params.id);
  if (!product)
    return NextResponse.json(
      { message: "Produto não encontrado!" },
      { status: 404 }
    );
  return NextResponse.json(product, { status: 200 });
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  await service.remove(params.id);
  return NextResponse.json(
    { message: "Produto removido com sucesso!" },
    { status: 200 }
  );
}
