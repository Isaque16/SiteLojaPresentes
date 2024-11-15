"use client";
import ProductCardBasket from "@/components/ProductCardBasket";
import { RootState } from "@/store/store";
import Link from "next/link";
import { useSelector } from "react-redux";

export default function Cesta() {
  const basket = useSelector((state: RootState) => state.basket);

  return basket.items.length == 0 ? (
    <p className="text-2xl text-center flex flex-col justify-center items-center h-screen">
      Tudo limpo por aqui,{" "}
      <Link href="/catalogo" className="link-hover text-info">
        adicione
      </Link>{" "}
      um novo produto à cesta.
    </p>
  ) : (
    <>
      <main className="flex flex-col items-center justify-center h-screen">
        <div className="flex flex-col items-center justify-center h-full">
          <div className="text-center pt-52 pb-5 md:pt-0">
            <h1 className="text-3xl font-bold">Sua Cesta</h1>
          </div>
          <div className="flex flex-col justify-between">
            {basket.items.map((item, index) => (
              <ProductCardBasket key={item._id} item={item} index={index} />
            ))}
            <div className="bg-base-200 py-2 px-5">
              <p className="text-xl font-bold">
                {basket.quantities.reduce((acc, cur) => acc + cur, 0)} itens
              </p>
              <p className="text-xl font-bold">
                Sub-total: <span className="text-sm">R$</span>
                {basket.totalValue}
              </p>
            </div>
            <div>
              <Link
                href="/compra"
                className="btn btn-success w-fit m-5 text-xl text-white"
              >
                Finalizar compra
              </Link>
            </div>
          </div>
        </div>
      </main>
      )
    </>
  );
}
