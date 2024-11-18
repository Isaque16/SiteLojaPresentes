import IAddress from "@/interfaces/IAdress";
import { saveCustomerAdress } from "@/server/services/CustomerService";
import { NextResponse } from "next/server";

export async function PUT(req: Request) {
  try {
    const { _id, endereco }: { _id: string; endereco: IAddress } =
      await req.json();
    await saveCustomerAdress(_id, endereco);
    return NextResponse.json(
      { message: "Endereço salvo com sucesso" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Erro ao salvar endereco" },
      { status: 500 }
    );
  }
}
