import IProduct from '@/interfaces/IProduct';
import { useBasketStore } from '@/store';
import formatCurrency from '@/utils/formatCurrency';

type ProductCardBasketProps = {
  item: IProduct;
  index: number;
};

export default function ProductCardBasket({
  item,
  index
}: ProductCardBasketProps) {
  const { quantities } = useBasketStore();
  return (
    <article
      className="bg-base-100 text-xl px-10 py-5 gap-10 flex flex-col md:flex-row justify-between items-center w-full ring-base-300 ring-1 rounded-lg"
      aria-label={`Item no carrinho: ${item.nome}`}
    >
      <div className="flex flex-col md:flex-row items-center gap-5">
        <figure className="image-full">
          <img
            src={item.imagem[0]}
            alt={item.nome}
            className="max-h-32 object-contain"
          />
        </figure>
        <div>
          <h3 className="text-xl">Produto: {item.nome}</h3>
          <p>Categoria: {item.categoria}</p>
          <p className="text-xl font-bold">{formatCurrency(item.preco)}</p>
        </div>
      </div>
      <div className="flex flex-row md:flex-col gap-5 items-center">
        <div
          className="bg-base-200 text-xl font-bold rounded-box text-white w-fit h-fit px-3 py-2 card-actions"
          aria-label={`Quantidade: ${quantities[index]}`}
        >
          {quantities[index]}
        </div>
      </div>
    </article>
  );
}
