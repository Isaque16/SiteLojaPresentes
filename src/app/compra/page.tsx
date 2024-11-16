"use client";
import BasketItem from "@/components/BasketItem";
import IOrder, { EFormaPagamento, EStatus } from "@/interfaces/IOrder";
import { clearBasket } from "@/store/slices/basketSlice";
import { RootState } from "@/store/store";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function Compra() {
  const router = useRouter();
  const userData = useSelector((state: RootState) => state.user);
  const cesta = useSelector((state: RootState) => state.basket);
  const dispatch = useDispatch();

  const [entrega, setEntrega] = useState<string>("sem_entrega");
  const [pagamento, setPagamento] = useState<string>("pix");

  async function sendCreatOrder() {
    const customersOrder: IOrder = {
      cliente: userData,
      cesta: cesta.items,
      subTotal: cesta.totalValue,
      valorFrete: 10,
      valorTotal: cesta.totalValue + 10,
      status: EStatus.PENDENTE,
      formaPagamento:
        EFormaPagamento[pagamento as keyof typeof EFormaPagamento],
      dataPedido: new Date(),
      metodoEnvio: entrega
    };

    await fetch("/api/pedido", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(customersOrder)
    });

    // Checkout com Stripe
  }

  function cancelOrder() {
    dispatch(clearBasket());
    router.replace("/catalogo");
  }

  const basket = useSelector((state: RootState) => state.basket);
  return basket.items.length == 0 ? (
    <div className="flex flex-col justify-center items-center h-screen px-5">
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
        <div className="flex flex-row items-center gap-2">
          <label className="label" htmlFor="sem_entrega">
            Pegar
          </label>
          <input
            className="radio radio-xs radio-primary"
            type="radio"
            name="entrega"
            id="sem_entrega"
            value="sem_entrega"
            checked={entrega === "sem_entrega"}
            onChange={(e) => setEntrega(e.target.value)}
          />
          <label className="label" htmlFor="entrega">
            Delivery
          </label>
          <input
            className="radio radio-xs radio-primary"
            type="radio"
            name="entrega"
            id="entrega"
            value="entrega"
            checked={entrega === "entrega"}
            onChange={(e) => setEntrega(e.target.value)}
          />
          {entrega === "entrega" ? (
            <input
              type="text"
              name="endereco"
              id="endereco"
              placeholder="Digite seu endereco"
            />
          ) : (
            "endereço"
          )}
        </div>
      </div>

      <div className="card card-body card-bordered shadow-md">
        <h1 className="card-title text-2xl">Forma de pagamento</h1>
        <select
          className="select select-ghost w-fit"
          name="pagamento"
          id="pagamento"
          value={pagamento}
          onChange={(e) => setPagamento(e.target.value)}
        >
          <option value="pix">Pix</option>
          <option value="dinheiro">Dinheiro</option>
          <option value="credito">Cartão de crédito</option>
          <option value="debito">Cartão de débito</option>
          <option value="boleto">Boleto bancário</option>
        </select>
      </div>
      <div className="card card-body card-bordered shadow-md">
        <h1 className="card-title text-2xl">Resumo do pedido</h1>
        {basket.items.map((item, index) => (
          <BasketItem key={item._id} item={item} index={index} />
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
          <button
            onClick={sendCreatOrder}
            className="btn btn-success text-white"
          >
            Confirmar pedido
          </button>
          <button onClick={cancelOrder} className="btn btn-error text-white">
            Cancelar pedido
          </button>
        </div>
      </div>
    </main>
  );
}
