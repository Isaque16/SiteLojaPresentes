"use client";

import IProduct from "@/interfaces/IProduct";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import LoadingProduct from "./loading";
import { useDispatch } from "react-redux";
import { addToBasket } from "@/store/slices/basketSlice";

export default function Produto() {
  const { _id: productId } = useParams();
  const dipatch = useDispatch();
  const router = useRouter();

  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState<IProduct>({} as IProduct);
  const [loadingProduct, setLoadingProduct] = useState(true);

  // Função para buscar os produtos
  async function getProduct(): Promise<void> {
    setLoadingProduct(true);
    try {
      const response = await fetch(`/api/produtos/${productId}`);
      const data = await response.json();
      setProduct(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingProduct(false);
    }
  }
  useEffect(() => {
    getProduct();
  }, []);

  function sendAddToBasket(): void {
    dipatch(addToBasket({ product, quantity }));
    router.replace("/cesta");
  }

  if (loadingProduct) return <LoadingProduct />;
  return (
    <>
      <main className="flex flex-col md:flex-row justify-around items-center gap-10 h-screen">
        <div className="bg-base-100 w-1/2 h-96 p-4 rounded-box m-4">
          <img
            className="w-full h-full"
            src={product.imagem}
            alt={product.nomeImagem}
          />
        </div>
        <div className="flex flex-col gap-4 w-full md:w-1/2 px-10">
          <h1 className="text-4xl font-bold">{product.nome}</h1>
          <p>{product.descricao}</p>
          <p className="text-xl font-bold">
            R$<span className="text-4xl">{product.preco}</span>
          </p>
          <p>Categoria: {product.categoria}</p>
          <div className="bg-slate-300 text-xl rounded-box text-black w-fit h-fit px-3 py-2 flex flex-row gap-2">
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
                setQuantity((q) => Math.min(product.quantidade, (q += 1)))
              }
            >
              +
            </button>
          </div>
          <div className="flex flex-col gap-5 p-4">
            <button
              onClick={sendAddToBasket}
              className="bg-base-100 text-xl text-white btn btn-primary rounded-btn"
            >
              Adicionar à cesta
            </button>
            <button className="bg-base-100 text-xl text-white btn btn-secondary rounded-btn">
              Comprar
            </button>
          </div>
        </div>
      </main>
    </>
  );
}
