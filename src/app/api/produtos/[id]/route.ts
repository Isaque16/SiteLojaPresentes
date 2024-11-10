"use server";
import connectToDatabase from "@/server/database/connectDB";
import ProductService from "@/server/services/ProductService";
import { NextResponse } from "next/server";

connectToDatabase();
const service = new ProductService();

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const product = await service.findProductById(params.id);
    if (!product) {
      return NextResponse.json(
        { message: "Produto não encontrado!" },
        { status: 404 }
      );
    }
    return NextResponse.json(product, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Erro ao buscar produto" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const product = await service.findProductById(params.id);
    if (!product) {
      return NextResponse.json(
        { message: "Produto não encontrado!" },
        { status: 404 }
      );
    }

    await service.removeProductById(params.id);
    return NextResponse.json(
      { message: "Produto removido com sucesso!" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Erro ao remover produto" },
      { status: 500 }
    );
  }
}
