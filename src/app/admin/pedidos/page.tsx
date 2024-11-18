"use client";
import EStatus, { nextStatus } from "@/interfaces/EStatus";
import IOrder from "@/interfaces/IOrder";
import { useEffect, useState } from "react";
import LoadingOrders from "./loading";

export default function OrdersManage() {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(true);

  useEffect(() => {
    (async () => {
      setIsLoadingOrders(true);
      try {
        const response = await fetch("/api/pedidos");
        const data = await response.json();
        setOrders(data);
      } catch (error) {
        console.error(error);
        setOrders([]);
      } finally {
        setIsLoadingOrders(false);
      }
    })();
  }, []);

  async function sendUpdateStatus(orderId: string, currentStatus: EStatus) {
    const updatedStatus: EStatus = nextStatus(currentStatus);
    console.log(updatedStatus);
    const response = await fetch("/api/pedidos/status", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId, updatedStatus })
    });
    console.log(response.json());

    if (response.ok) {
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, status: updatedStatus } : order
        )
      );
    }
  }

  return (
    <main>
      <div className="flex flex-col items-center justify-center">
        <div className="flex flex-col items-center justify-center">
          <h1 className="text-3xl font-bold text-center pt-10 pb-2">Pedidos</h1>
          <div className="border-2 border-white md:w-1/12 w-1/2 mb-5"></div>
        </div>
        <div
          id="orders_container"
          className="grid grid-col-1 gap-5 justify-center md:justify-normal md:w-96 w-full overflow-y-scroll overflow-x-hidden min-w-80 md:min-w-fit max-h-screen border-2 border-white rounded-lg p-10"
        >
          {isLoadingOrders ? (
            <LoadingOrders />
          ) : (
            orders.map((order) => (
              <div
                key={order._id}
                className="bg-base-300 py-2 rounded-box flex flex-col items-center justify-center gap-2"
              >
                <div className="card card-body card-bordered shadow-md">
                  <p>
                    Pedido feito por{" "}
                    <span className="font-bold">
                      {order.cliente.nomeCompleto}
                    </span>
                  </p>
                  <p>
                    Produtos da cesta: <br />
                    <span className="font-bold">
                      {order.cesta.map((produto) => produto.nome).join(", ")}
                    </span>
                  </p>
                  <p>
                    Subtotal da compra:{" "}
                    <span className="font-bold">R${order.subTotal}</span>
                  </p>
                  <p>
                    Valor total da compra:{" "}
                    <span className="font-bold">R${order.valorTotal}</span>
                  </p>
                  <p>
                    Forma de pagamento:{" "}
                    <span className="font-bold">{order.formaPagamento}</span>
                  </p>
                  <p>
                    Status atual:{" "}
                    <span className="font-bold">{order.status}</span>
                  </p>
                  <p>
                    Metodo de envio:{" "}
                    <span className="font-bold">{order.metodoEnvio}</span>
                  </p>
                  {order.metodoEnvio == "entrega" || (
                    <p>
                      Endereço:{" "}
                      <span className="font-bold">
                        {order.enderecoEntrega?.CEP}
                      </span>
                    </p>
                  )}
                </div>
                <div className="flex flex-row gap-5 mb-10 md:mb-0">
                  <button
                    onClick={() => sendUpdateStatus(order._id!, order.status)}
                    className="btn"
                  >
                    Atualizar status
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}
