import IProduct from "@/interfaces/IProduct";
import { removeFromBasket, updateQuantity } from "@/store/slices/basketSlice";
import { RootState } from "@/store/store";
import { useDispatch, useSelector } from "react-redux";

export default function BasketItem({
  item,
  index
}: {
  item: IProduct;
  index: number;
}) {
  const dispatch = useDispatch();
  const basket = useSelector((state: RootState) => state.basket);

  return (
    <div
      key={item._id}
      className="bg-base-100 text-xl px-10 py-5 gap-10 flex flex-col md:flex-row justify-between items-center w-full ring-base-300 ring-1"
    >
      <div
        key={item._id}
        className="flex flex-col md:flex-row items-center gap-5"
      >
        <figure className="image-full">
          <img src={item.imagem} alt={item.nomeImagem} />
        </figure>
        <div>
          <p className="text-xl">Produto: {item.nome}</p>
          <p>Categoria: {item.categoria}</p>
          <p className="text-xl font-bold">
            <span className="text-sm">R$</span>
            {item.preco}
          </p>
        </div>
      </div>
      <div className="flex flex-row md:flex-col gap-5">
        <div className="bg-slate-300 text-xl rounded-box text-black w-fit h-fit px-3 py-2 card-actions">
          <button
            className="px-2 text-xl"
            onClick={() =>
              dispatch(
                updateQuantity({
                  index,
                  quantity: Math.max(1, basket.quantities[index] - 1)
                })
              )
            }
          >
            -
          </button>
          {basket.quantities[index]}
          <button
            className="px-2 text-xl"
            onClick={() =>
              dispatch(
                updateQuantity({
                  index,
                  quantity: Math.min(
                    item.quantidade,
                    basket.quantities[index] + 1
                  )
                })
              )
            }
          >
            +
          </button>
        </div>
        <button
          className="btn btn-error text-white"
          onClick={() => dispatch(removeFromBasket(item._id))}
        >
          Remover
        </button>
      </div>
    </div>
  );
}
