"use server";
import ProductService from "@/server/services/ProductService";

const service = new ProductService();

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const product = await service.findById(params.id);
  if (!product)
    return Response.json(
      { message: "Produto não encontrado!" },
      { status: 404 }
    );
  return Response.json(product, { status: 200 });
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  await service.remove(params.id);
  return Response.json(
    { message: "Produto removido com sucesso!" },
    { status: 200 }
  );
}
