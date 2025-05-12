"use client";
import { EmptyContentMessage, ProductCardBasket } from "@/components";
import trpc from "@/trpc/client/trpc";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Comprado() {
  const { _id } = useParams();
  const { data } = trpc.orders.getById.useQuery(_id as string);
  const [order, setOrder] = useState<typeof data>(undefined);

  useEffect(() => {
    setOrder(data);
  }, [data]);

  return order?._id ? (
    <EmptyContentMessage />
  ) : (
    <main className="card card-body p-5">
      <div>
        <h1 className="text-center text-3xl font-bold pt-20">
          Pedido realizado com sucesso!
        </h1>
      </div>
      <div className="card card-body card-bordered shadow-md">
        <h1 className="card-title text-2xl">Detalhes do pedido</h1>
        <div className="grid grid-cols-1 md:grid-cols-3">
          {order?.metodoEnvio == "entrega" && (
            <div>
              <h1 className="text-xl">Endereço de envio</h1>
              <ul>
                <li>{order?.cliente?.nomeCompleto}</li>
                <li>
                  {order.enderecoEntrega?.rua} {order.enderecoEntrega?.numero}
                </li>
                <li>{order.enderecoEntrega?.bairro}</li>
                <li>
                  {order.enderecoEntrega?.cidade},{" "}
                  {order.enderecoEntrega?.estado}, {order.enderecoEntrega?.CEP}
                </li>
              </ul>
            </div>
          )}
          <div>
            <h1 className="text-xl">Método de pagamento</h1>
            <ul>
              <li>{order?.formaPagamento}</li>
            </ul>
          </div>
          <div>
            <h1 className="text-xl">Resumo do pedido</h1>
            <ul>
              <li>Subtotal do(s) item(s): R${order?.subTotal}</li>
              <li>Frete e manuseio: R${order?.valorFrete}</li>
              <li>Total: R${order?.valorTotal}</li>
            </ul>
          </div>
        </div>
      </div>
      <div className="card card-body card-bordered shadow-md">
        <h1 className="card-title text-2xl">Resumo do pedido</h1>
        <div>
          {order?.cesta.map((item, index) => (
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
