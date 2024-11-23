import IOrder from "@/interfaces/IOrder";

export default function OrderCard({ order }: { order: IOrder }) {
  return (
    <div
      key={order._id}
      className="bg-base-300 py-2 rounded-box flex flex-col items-center justify-center gap-2"
    >
      <div className="card card-body card-bordered shadow-md">
        <p>
          Pedido feito por{" "}
          <span className="font-bold">{order.cliente.nomeCompleto}</span>
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
          Status atual: <span className="font-bold">{order.status}</span>
        </p>
        <p>
          Metodo de envio:{" "}
          <span className="font-bold">{order.metodoEnvio}</span>
        </p>
        {order.metodoEnvio === "entrega" && (
          <p>
            Endereço:{" "}
            <span className="font-bold">{order.enderecoEntrega?.CEP}</span>
          </p>
        )}
      </div>
    </div>
  );
}
