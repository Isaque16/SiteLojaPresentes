"use client";

import { removeFromBasket, updateQuantity } from "@/store/basketSlice";
import { RootState } from "@/store/store";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";

export default function Cesta() {
  const basket = useSelector((state: RootState) => state.basket);
  const dispatch = useDispatch();

  return (
    <>
      <main className="h-screen">
        <div className="text-center py-5">
          <h1 className="text-3xl font-bold">Sua Cesta</h1>
        </div>

        {basket.items.length == 0 ? (
          <p className="text-2xl text-center">
            Tudo limpo por aqui,{" "}
            <Link href="/catalogo" className="link-hover text-info">
              adicione
            </Link>{" "}
            um novo produto à cesta.
          </p>
        ) : (
          <div className="flex flex-col justify-between">
            {basket.items.map((item, index) => (
              <div
                key={item._id}
                className="bg-base-100 text-xl px-10 py-5 flex flex-row justify-between items-center w-full"
              >
                <div
                  key={item._id}
                  className="flex flex-row items-center gap-5"
                >
                  <div>
                    <img src={item.imagem} alt={item.nomeImagem} />
                  </div>
                  <div>
                    <p>Produto: {item.nome}</p>
                    <p>Categoria: {item.categoria}</p>
                    <p className="text-sm font-bold">
                      R$<span className="text-xl">{item.preco}</span>
                    </p>
                  </div>
                </div>
                <div className="flex flex-col gap-5">
                  <div className="bg-slate-300 text-xl rounded-box text-black w-fit h-fit px-3 py-2 flex flex-row gap-2">
                    <button
                      className="px-2 text-xl"
                      onClick={() =>
                        dispatch(
                          updateQuantity({
                            index,
                            quantity: Math.max(1, basket.quantities[index] - 1) // Reduz sem modificar diretamente
                          })
                        )
                      }
                    >
                      -
                    </button>
                    {basket.quantities[index]}
                    <button
                      className="px-2 text-xl"
                      onClick={() =>
                        dispatch(
                          updateQuantity({
                            index,
                            quantity: Math.min(
                              item.quantidade,
                              basket.quantities[index] + 1
                            ) // Incrementa sem modificar diretamente
                          })
                        )
                      }
                    >
                      +
                    </button>
                  </div>
                  <button
                    className="btn btn-error text-white"
                    onClick={() => dispatch(removeFromBasket(item._id))}
                  >
                    Remover
                  </button>
                </div>
              </div>
            ))}
            <button className="btn btn-success w-fit m-5 text-xl text-white">
              Finalizar compra
            </button>
            <div className="bg-base-200 py-2 px-5">
              <p>Itens: {basket.quantities.length}</p>
              <p className="text-sm font-bold">
                Sub-total: R$
                <span className="text-xl">{basket.totalValue}</span>
              </p>
            </div>
          </div>
        )}
      </main>
    </>
  );
}
