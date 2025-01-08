"use client";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import LoadingProduct from "./loading";
import { useDispatch } from "react-redux";
import { addToBasket } from "@/store/slices/basketSlice";
import trpc from "@/trpc/client/trpc";

export default function Produto() {
  const { _id: productId }: { _id: string } = useParams();
  const { data: product, isLoading: isLoadingProduct } =
    trpc.products.getById.useQuery(productId);

  const router = useRouter();
  const dipatch = useDispatch();

  const isOutOfStock = product?.quantidade === 0;
  const [quantity, setQuantity] = useState(isOutOfStock ? 0 : 1);

  function sendAddToBasket() {
    dipatch(addToBasket({ product, quantity }));
    router.replace("/cesta");
  }

  function sendBuyProduct() {
    dipatch(addToBasket({ product, quantity }));
    router.replace("/cesta/compra");
  }

  if (isLoadingProduct) return <LoadingProduct />;
  return (
    <main className="flex flex-col md:flex-row justify-around items-center gap-10 h-full md:h-screen">
      <figure className="bg-base-100 w-1/2 h-96 p-4 rounded-box m-5 image-full">
        <img
          className="w-full h-full"
          src={product?.imagem}
          alt={product?.nomeImagem}
        />
      </figure>
      <div className="flex flex-col gap-4 w-full md:w-1/2 px-10">
        <h1 className="text-4xl font-bold">{product?.nome}</h1>
        <p>{product?.descricao}</p>
        <p className="text-xl font-bold">
          R$<span className="text-4xl">{product?.preco}</span>
        </p>
        <p>Categoria: {product?.categoria}</p>
        <p
          className={product?.quantidade !== 0 ? "text-success" : "text-error"}
        >
          {isOutOfStock ? "Esgotado" : "Em estoque"}
        </p>
        <div className="bg-slate-300 text-xl rounded-box text-black w-fit h-fit px-2 py-2 flex flex-row gap-2">
          <button
            className="px-2 text-xl"
            onClick={() => setQuantity((q) => Math.max(1, (q -= 1)))}
          >
            -
          </button>
          {quantity}
          <button
            className="px-2 text-xl"
            onClick={() =>
              setQuantity((q) => Math.min(product!.quantidade, (q += 1)))
            }
          >
            +
          </button>
        </div>
        <div className="flex flex-col gap-5 mt-5 mb-10">
          <button
            onClick={sendAddToBasket}
            className={`bg-base-100 text-xl text-white btn btn-primary rounded-btn ${
              isOutOfStock && "btn-disabled"
            }`}
          >
            Adicionar à cesta
          </button>
          <button
            onClick={sendBuyProduct}
            className={`bg-base-100 text-xl text-white btn btn-secondary rounded-btn ${
              isOutOfStock && "btn-disabled"
            }`}
          >
            Comprar
          </button>
        </div>
      </div>
    </main>
  );
}
