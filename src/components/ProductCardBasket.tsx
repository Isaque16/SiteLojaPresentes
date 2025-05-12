import IProduct from "@/interfaces/IProduct";
import { useBasketStore } from "@/store";

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
    <div
      key={index}
      className="bg-base-100 text-xl px-10 py-5 gap-10 flex flex-col md:flex-row justify-between items-center w-full ring-base-300 ring-1"
    >
      <div key={index} className="flex flex-col md:flex-row items-center gap-5">
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
        <div className="bg-base-200 text-xl font-bold rounded-box text-white w-fit h-fit px-3 py-2 card-actions">
          {quantities[index]}
        </div>
      </div>
    </div>
  );
}
