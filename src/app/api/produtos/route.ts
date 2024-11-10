"use server";
import { NextResponse } from "next/server";
import ProductService from "@/server/services/ProductService";
import IProduct from "@/interfaces/IProduct";
import connectToDatabase from "@/server/database/connectDB";

connectToDatabase();
const service = new ProductService();

export async function GET() {
  try {
    const products = await service.getAllProducts();
    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Erro ao listar produtos" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const productData: IProduct = await req.json();
    await service.saveProduct(productData);
    return NextResponse.json(
      { message: "Produto criado com sucesso!" },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Erro ao criar produto" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const productData: IProduct = await req.json();
    await service.saveProduct(productData);
    return NextResponse.json(
      { message: "Produto atualizado com sucesso!" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Erro ao atualizar produto" },
      { status: 500 }
    );
  }
}
