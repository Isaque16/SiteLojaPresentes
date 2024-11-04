"use client";
import ProductCard from "@/components/ProductCard";
import IProduct from "@/server/interfaces/IProduct";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Catalogo() {
  const [products, setProducts] = useState<IProduct[]>([]);

  // Função para buscar os produtos
  async function getProducts(): Promise<void> {
    try {
      const response = await fetch("/api/produtos");
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error(error);
      setProducts([]);
    }
  }
  useEffect(() => {
    getProducts();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-4 p-10">Catálogo</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {products.map((product) => (
          <Link href={`/catalogo/${product._id}`} key={product._id}>
            <ProductCard
              key={product._id}
              imagePath={product.imagem}
              imageAlt={product.nome}
              productTitle={product.nome}
              productDescription={product.descricao}
              productPrice={`R$ ${product.preco}`}
              id={product._id!}
            />
          </Link>
        ))}
      </div>
    </div>
  );
}
