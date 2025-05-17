'use client';
import LoadingCatalog from './loading';
import trpc from '@/trpc/client/trpc';
import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { IPagedQuery } from '@/interfaces';
import { ProductCard, Pagination } from '@/components';

export default function Catalogo() {
  const searchParam = useSearchParams().get('search') || '';
  const [pagination, setPagination] = useState<IPagedQuery>({
    page: 1,
    size: 10,
    search: searchParam
  });

  useEffect(() => {
    setPagination(prev => ({
      ...prev,
      page: 1,
      search: searchParam
    }));
  }, [searchParam]);

  const { data: products, isLoading } =
    trpc.products.getAllPaged.useQuery(pagination);

  return isLoading ? (
    <LoadingCatalog />
  ) : (
    <main className="flex flex-col items-center justify-center">
      <div className="flex flex-col items-center">
        <h1 className="text-4xl font-bold text-center pt-10 pb-2">CATÁLOGO</h1>
        <div className="border-2 border-white md:w-1/6 w-1/2 mb-5"></div>
      </div>
      <p className="text-left text-xl py-5">
        {searchParam && (
          (products?.items.length ?? 0) > 0
            ? `${products?.items.length} Resultados para ${searchParam}`
            : 'Nenhum produto encontrado'
        )}
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {products?.items.map((product) => (
          <ProductCard
            key={product._id}
            imagePath={product.imagem[0]}
            imageAlt={product.nome}
            productTitle={product.nome}
            productDescription={product.descricao}
            productPrice={product.preco.toString()}
            id={product._id!}
          />
        ))}
      </div>

      <div className="my-8">
        <Pagination 
          currentPage={pagination.page} 
          totalPages={products?.pagination.totalPages || 0}
          onPageChange={(page) => setPagination({ ...pagination, page })}
          className="my-4"
        />
      </div>
    </main>
  );
}
