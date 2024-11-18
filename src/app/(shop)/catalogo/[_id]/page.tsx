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
  const [isLoadingProduct, setIsLoadingProducts] = useState(true);

  useEffect(() => {
    (async () => {
      setIsLoadingProducts(true);
      try {
        const response = await fetch(`/api/produtos/${productId}`);
        const data = await response.json();
        setProduct(data);
      } catch (error) {
        console.error(error);
        setProduct({} as IProduct);
      } finally {
        setIsLoadingProducts(false);
      }
    })(); // A função é criada e imediatamente executada
  }, []);

  function sendAddToBasket(): void {
    dipatch(addToBasket({ product, quantity }));
    router.replace("/cesta");
  }

  if (isLoadingProduct) return <LoadingProduct />;
  return (
    <main className="flex flex-col md:flex-row justify-around items-center gap-10 h-full md:h-screen">
      <figure className="bg-base-100 w-1/2 h-96 p-4 rounded-box m-5 image-full">
        <img
          className="w-full h-full"
          src={product.imagem}
          alt={product.nomeImagem}
        />
      </figure>
      <div className="flex flex-col gap-4 w-full md:w-1/2 px-10">
        <h1 className="text-4xl font-bold">{product.nome}</h1>
        <p>{product.descricao}</p>
        <p className="text-xl font-bold">
          R$<span className="text-4xl">{product.preco}</span>
        </p>
        <p>Categoria: {product.categoria}</p>
        <p className={product.quantidade !== 0 ? "text-success" : "text-error"}>
          {product.quantidade !== 0 ? "Em estoque" : "Esgotado"}
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
              setQuantity((q) => Math.min(product.quantidade, (q += 1)))
            }
          >
            +
          </button>
        </div>
        <div className="flex flex-col gap-5 mt-5 mb-10">
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
  );
}
