"use client";
import EStatus, { nextStatus } from "@/interfaces/EStatus";
import LoadingOrders from "./loading";
import trpc from "@/trpc/client/trpc";
import OrderCard from "@/components/OrderCard";

export default function OrdersManage() {
  const { data: orders, refetch, isLoading } = trpc.orders.getAll.useQuery();
  const { mutate: updateStatusMutation } = trpc.orders.updateStatus.useMutation(
    { onSuccess: () => refetch() }
  );

  async function sendUpdateStatus(orderId: string, currentStatus: EStatus) {
    const updatedStatus = nextStatus(currentStatus);
    updateStatusMutation({
      orderId,
      updatedStatus
    });
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
          {isLoading ? (
            <LoadingOrders />
          ) : (
            orders?.map((order) => (
              <div
                key={order._id}
                className="bg-base-300 py-2 rounded-box flex flex-col items-center justify-center gap-2"
              >
                <OrderCard key={order._id} order={order} />
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
