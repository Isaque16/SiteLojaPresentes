"use client";
import BasketItem from "@/components/BasketItem";
import { clearBasket } from "@/store/slices/basketSlice";
import { RootState } from "@/store/store";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";

export default function Cesta() {
  const dispatch = useDispatch();
  const basket = useSelector((state: RootState) => state.basket);

  return basket.items.length == 0 ? (
    <div className="flex flex-col justify-center items-center h-screen px-5">
      <p className="text-2xl text-center">
        Tudo limpo por aqui,{" "}
        <Link href="/catalogo" className="link-hover text-info">
          adicione
        </Link>{" "}
        um novo produto à cesta.
      </p>
    </div>
  ) : (
    <>
      <main className="flex flex-col items-center justify-center h-full">
        <div className="flex flex-col items-center justify-center h-full">
          <div className="flex flex-col items-center text-center my-10">
            <h1 className="text-3xl font-bold text-center pt-10 pb-2">
              Sua Cesta
            </h1>
            <div className="border-2 border-white w-1/2 mb-5"></div>
          </div>
          <div className="flex flex-col justify-between border-base-300 border-2 rounded-box">
            {basket.items.map((item, index) => (
              <BasketItem key={item._id} item={item} index={index} />
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
                href="/catalogo"
                className="btn btn-info w-fit m-5 text-xl text-white"
              >
                Continuar comprando
              </Link>
              <Link
                href="/cesta/compra"
                className="btn btn-success w-fit m-5 text-xl text-white"
              >
                Finalizar compra
              </Link>
              <button
                onClick={() => dispatch(clearBasket())}
                className="btn btn-error w-fit m-5 text-xl text-white"
              >
                Limpar Lista
              </button>
            </div>
          </div>
        </div>
      </main>
      )
    </>
  );
}
