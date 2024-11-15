"use client";
import ProductCardBasket from "@/components/ProductCardBasket";
import { RootState } from "@/store/store";
import Link from "next/link";
import { useSelector } from "react-redux";

export default function Compra() {
  const basket = useSelector((state: RootState) => state.basket);
  return basket.items.length == 0 ? (
    <div className="flex flex-col justify-center items-center h-screen">
      <p className="text-2xl text-center">
        Tudo limpo por aqui,{" "}
        <Link href="/catalogo" className="link-hover text-info">
          adicione
        </Link>{" "}
        um novo produto à cesta.
      </p>
    </div>
  ) : (
    <main className="card card-body p-5">
      <div>
        <h1 className="text-center text-3xl font-bold pt-20">
          Finalização da compra
        </h1>
      </div>
      <div className="card card-body card-bordered shadow-md">
        <h1 className="card-title text-2xl">Endereço de entrega</h1>
        <p className="text-warning">Nenhum endereço cadastrado</p>
        <div className="flex flex-row items-center gap-2">
          <label className="label" htmlFor="sem_entrega">
            Pegar
          </label>
          <input
            className="radio radio-xs radio-primary"
            type="radio"
            name="entrega"
            id="sem_entrega"
          />
          <label className="label" htmlFor="entrega">
            Delivery
          </label>
          <input
            className="radio radio-xs radio-primary"
            type="radio"
            name="entrega"
            id="entrega"
          />
        </div>
      </div>
      <div className="card card-body card-bordered shadow-md">
        <h1 className="card-title text-2xl">Forma de pagamento</h1>
        <select
          className="select select-ghost w-fit"
          name="pagamento"
          id="pagamento"
        >
          <option value="pix">Pix</option>
          <option value="credito">Cartão de crédito</option>
          <option value="debito">Cartão de débito</option>
          <option value="boleto">Boleto bancário</option>
        </select>
      </div>
      <div className="card card-body card-bordered shadow-md">
        <h1 className="card-title text-2xl">Resumo do pedido</h1>
        {basket.items.map((item, index) => (
          <ProductCardBasket key={item._id} item={item} index={index} />
        ))}
      </div>
      <div>
        <div>
          <p className="text-xl">
            {basket.quantities.reduce((acc, cur) => acc + cur, 0)} Itens
          </p>
          <p className="text-xl">
            Frete e manuseio: <span className="text-sm">R$</span>10
          </p>
          <p className="text-xl">
            Total do pedido: <span className="text-sm">R$</span>
            {basket.totalValue}
          </p>
        </div>
        <div className="flex flex-row gap-5 py-5">
          <button className="btn btn-success text-white">
            Confirmar pedido
          </button>
          <button className="btn btn-error text-white">Cancelar pedido</button>
        </div>
      </div>
    </main>
  );
}
