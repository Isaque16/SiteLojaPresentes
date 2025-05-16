'use client';
import { useBasketStore } from '@/store';
import trpc from '@/trpc/client/trpc';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import LoadingProduct from './loading';

export default function Produto() {
  const { _id: productId }: { _id: string } = useParams();
  const { data: product, isLoading: isLoadingProduct } =
    trpc.products.getById.useQuery(productId);

  const router = useRouter();
  const { addToBasket } = useBasketStore();

  const isOutOfStock = product?.quantidade === 0;
  const [quantity, setQuantity] = useState(isOutOfStock ? 0 : 1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  function sendAddToBasket() {
    addToBasket(product!, quantity);
    router.replace('/cesta');
  }

  function sendBuyProduct() {
    addToBasket(product!, quantity);
    router.replace('/cesta/compra');
  }

  function handleImageChange(index: number) {
    setCurrentImageIndex(index);
  }

  if (isLoadingProduct) return <LoadingProduct />;

  // Garantir que imagem seja tratada como array
  const images = Array.isArray(product?.imagem)
    ? product?.imagem
    : [product?.imagem];
  const imageNames = Array.isArray(product?.nomeImagem)
    ? product?.nomeImagem
    : [product?.nomeImagem];

  return (
    <main className="flex flex-col md:flex-row justify-around items-center gap-10 h-full md:h-screen">
      <div className="w-full md:w-1/2 flex flex-col items-center">
        <figure className="bg-base-100 w-full h-96 p-4 rounded-box m-5 image-full">
          <img
            className="w-full h-full object-contain"
            src={images[currentImageIndex]}
            alt={imageNames[currentImageIndex] || product?.nome}
          />
        </figure>

        {images.length > 1 && (
          <div className="flex overflow-x-auto gap-2 p-2 w-full justify-center">
            {images.map((img, index) => (
              <div
                key={index}
                onClick={() => handleImageChange(index)}
                className={`cursor-pointer border-2 ${
                  index === currentImageIndex
                    ? 'border-primary'
                    : 'border-transparent hover:border-base-300'
                } transition-all`}
              >
                <img
                  src={img}
                  alt={`Miniatura ${index + 1}`}
                  className="w-16 h-16 object-cover rounded"
                />
              </div>
            ))}
          </div>
        )}

        {images.length > 1 && (
          <div className="flex justify-center gap-4 my-2">
            <button
              className="btn btn-circle btn-sm"
              onClick={() =>
                setCurrentImageIndex((prev) =>
                  prev === 0 ? images.length - 1 : prev - 1
                )
              }
            >
              ❮
            </button>
            <span className="flex items-center">
              {currentImageIndex + 1}/{images.length}
            </span>
            <button
              className="btn btn-circle btn-sm"
              onClick={() =>
                setCurrentImageIndex((prev) =>
                  prev === images.length - 1 ? 0 : prev + 1
                )
              }
            >
              ❯
            </button>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-4 w-full md:w-1/2 px-10">
        <h1 className="text-4xl font-bold">{product?.nome}</h1>
        <p>{product?.descricao}</p>
        <p className="text-xl font-bold">
          R$<span className="text-4xl">{product?.preco}</span>
        </p>
        <p>Categoria: {product?.categoria}</p>
        <p
          className={product?.quantidade !== 0 ? 'text-success' : 'text-error'}
        >
          {isOutOfStock ? 'Esgotado' : 'Em estoque'}
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
              setQuantity((q) => Math.min(product!.quantidade, q + 1))
            }
          >
            +
          </button>
        </div>
        <div className="flex flex-col gap-5 mt-5 mb-10">
          <button
            onClick={sendAddToBasket}
            className={`bg-base-100 text-xl text-white btn btn-primary rounded-btn ${
              isOutOfStock && 'btn-disabled'
            }`}
          >
            Adicionar à cesta
          </button>
          <button
            onClick={sendBuyProduct}
            className={`bg-base-100 text-xl text-white btn btn-secondary rounded-btn ${
              isOutOfStock && 'btn-disabled'
            }`}
          >
            Comprar
          </button>
        </div>
      </div>
    </main>
  );
}
