"use client";
import ProductCard from "@/components/ProductCard";
import IProduct from "@/interfaces/IProduct";
import { useEffect, useState } from "react";
import LoadingCatalog from "./loading";

export default function Catalogo() {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  // Função para buscar os produtos
  async function getProducts(): Promise<void> {
    setLoadingProducts((prods) => prods != true);
    try {
      const response = await fetch("/api/produtos");
      const data = await response.json();
      setProducts(data);
      setTimeout(() => setLoadingProducts(false), 1000);
    } catch (error) {
      console.error(error);
      setProducts([]);
      setLoadingProducts(false);
    }
  }
  useEffect(() => {
    getProducts();
  }, []);

  if (loadingProducts) return <LoadingCatalog />;
  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-4 p-10">CATÁLOGO</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {products.map((product) => (
          <ProductCard
            key={product._id}
            imagePath={product.imagem}
            imageAlt={product.nome}
            productTitle={product.nome}
            productDescription={product.descricao}
            productPrice={`R$ ${product.preco}`}
            id={product._id!}
          />
        ))}
      </div>
    </div>
  );
}
