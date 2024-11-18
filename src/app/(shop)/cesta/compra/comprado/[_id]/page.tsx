"use client";
import ProductCardBasket from "@/components/ProductCardBasket";
import IOrder from "@/interfaces/IOrder";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Comprado() {
  const { _id } = useParams();
  const [order, setOrder] = useState<IOrder>({} as IOrder);
  const [isLoadingOrder, setIsLoadingOrder] = useState(true);

  useEffect(() => {
    (async () => {
      setIsLoadingOrder(true);
      try {
        const response = await fetch(`/api/pedidos/${_id}`);
        const data: IOrder = await response.json();
        setOrder(data);
      } catch (error) {
        console.error(error);
        setOrder({} as IOrder);
      } finally {
        setIsLoadingOrder(false);
      }
    })();
  }, []);
  const { enderecoEntrega } = order;

  return (
    <main className="card card-body p-5">
      <div>
        <h1 className="text-center text-3xl font-bold pt-20">
          Pedido realizado com sucesso!
        </h1>
      </div>
      <div className="card card-body card-bordered shadow-md">
        <h1 className="card-title text-2xl">Detalhes do pedido</h1>
        <div className="grid grid-cols-1 md:grid-cols-3">
          {order.metodoEnvio == "entrega" && (
            <div>
              <h1 className="text-xl">Endereço de envio</h1>
              <ul>
                <li>{order.cliente?.nomeCompleto}</li>
                <li>
                  {enderecoEntrega?.rua} {enderecoEntrega?.numero}
                </li>
                <li>{enderecoEntrega?.bairro}</li>
                <li>
                  {enderecoEntrega?.cidade}, {enderecoEntrega?.estado},{" "}
                  {enderecoEntrega?.CEP}
                </li>
              </ul>
            </div>
          )}
          <div>
            <h1 className="text-xl">Método de pagamento</h1>
            <ul>
              <li>{order.formaPagamento}</li>
            </ul>
          </div>
          <div>
            <h1 className="text-xl">Resumo do pedido</h1>
            <ul>
              <li>Subtotal do(s) item(s): R${order.subTotal}</li>
              <li>Frete e manuseio: R${order.valorFrete}</li>
              <li>Total: R${order.valorTotal}</li>
            </ul>
          </div>
        </div>
      </div>
      <div className="card card-body card-bordered shadow-md">
        <h1 className="card-title text-2xl">Resumo do pedido</h1>
        <div>
          {order.cesta?.map((item, index) => (
            <ProductCardBasket key={item._id} item={item} index={index} />
          ))}
        </div>
      </div>
      <div>
        <Link
          href="/catalogo"
          className="btn btn-info w-fit m-5 text-xl text-white"
        >
          Continuar comprando
        </Link>
      </div>
    </main>
  );
}
