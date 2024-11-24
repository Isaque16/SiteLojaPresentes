"use client";
import trpc from "@/trpc/client/trpc";
import LoadingOrders from "./loading";
import { getCookie } from "cookies-next/client";
import OrderCard from "@/components/OrderCard";

export default function HistoricoPedidos() {
  const userId = getCookie("id");
  const { data, isLoading } = trpc.customers.getById.useQuery(userId as string);
  const userHistory = data?.historicoDeCompras;

  return (
    <main>
      <div className="flex flex-col items-center justify-center">
        <div className="flex flex-col items-center justify-center">
          <h1 className="text-3xl font-bold text-center pt-10 pb-2">
            Histórico de compras
          </h1>
          <div className="border-2 border-white md:w-1/12 w-1/2 mb-5"></div>
        </div>
        <div
          id="orders_container"
          className="grid grid-col-1 gap-5 justify-center md:justify-normal md:w-96 w-full overflow-y-scroll overflow-x-hidden min-w-80 md:min-w-fit max-h-screen border-2 border-white rounded-lg p-10"
        >
          {isLoading ? (
            <LoadingOrders />
          ) : (
            userHistory?.map((order, index) => (
              <div
                key={index}
                className="bg-base-300 py-2 rounded-box flex flex-col items-center justify-center gap-2"
              >
                <OrderCard key={index} order={order} />
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}
