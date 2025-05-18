import IProduct from '@/interfaces/IProduct';
import { useBasketStore } from '@/store';
import formatCurrency from '@/utils/formatCurrency';

type BasketItemProps = {
  item: IProduct;
  index: number;
};

export default function BasketItem({ item, index }: BasketItemProps) {
  const { updateQuantity, removeFromBasket, quantities } = useBasketStore();

  return (
    <article
      className="bg-base-100 text-xl px-10 py-5 gap-10 flex flex-col md:flex-row justify-between items-center w-full ring-base-300 ring-1 rounded-lg"
      aria-label={`Item do carrinho: ${item.nome}`}
    >
      <div className="flex flex-col md:flex-row items-center gap-5">
        <figure className="image-full">
          <img
            src={item.imagem[0]}
            alt={item.nome || item.nomeImagem[0]}
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
          className="bg-slate-300 text-xl rounded-box text-black w-fit h-fit px-3 py-2 card-actions"
          role="group"
          aria-label="Controle de quantidade"
        >
          <button
            className="px-2 text-xl"
            onClick={() =>
              updateQuantity(index, Math.max(1, quantities[index] - 1))
            }
            aria-label="Diminuir quantidade"
            disabled={quantities[index] <= 1}
          >
            -
          </button>
          <span aria-live="polite">{quantities[index]}</span>
          <button
            className="px-2 text-xl"
            onClick={() =>
              updateQuantity(
                index,
                Math.min(item.quantidade, quantities[index] + 1)
              )
            }
            aria-label="Aumentar quantidade"
            disabled={quantities[index] >= item.quantidade}
          >
            +
          </button>
        </div>
        <button
          className="btn btn-error text-white"
          onClick={() => removeFromBasket(item._id!)}
          aria-label={`Remover ${item.nome} do carrinho`}
        >
          Remover
        </button>
      </div>
    </article>
  );
}
