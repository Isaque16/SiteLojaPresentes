"use client";
import ProductCard from "@/components/ProductCard";
import IProduct from "@/interfaces/IProduct";
import { useEffect, useState } from "react";
import LoadingCatalog from "./loading";

export default function Catalogo() {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);

  useEffect(() => {
    (async () => {
      setIsLoadingProducts(true);
      try {
        const response = await fetch("/api/produtos");
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error(error);
        setProducts([]);
      } finally {
        setIsLoadingProducts(false);
      }
    })();
  }, []);

  if (isLoadingProducts) return <LoadingCatalog />;
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="flex flex-col items-center">
        <h1 className="text-4xl font-bold text-center pt-10 pb-2">CATÁLOGO</h1>
        <div className="border-2 border-white md:w-1/6 w-1/2 mb-5"></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {products.map((product) => (
          <ProductCard
            key={product._id}
            imagePath={product.imagem}
            imageAlt={product.nome}
            productTitle={product.nome}
            productDescription={product.descricao}
            productPrice={product.preco.toString()}
            id={product._id!}
          />
        ))}
      </div>
    </div>
  );
}
