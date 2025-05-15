import IOrder from '@/interfaces/IOrder';
import formatCurrency from '@/utils/formatCurrency';

export default function OrderCard({ order }: { order: IOrder }) {
  return (
    <article className="bg-base-300 py-2 rounded-box">
      <div className="card card-body card-bordered shadow-md">
        <h3 className="text-lg font-semibold mb-2">
          Pedido #{order._id!.substring(0, 8)}
        </h3>

        <p>
          Cliente:{' '}
          <span className="font-bold">{order.cliente.nomeCompleto}</span>
        </p>

        <div className="divider my-1"></div>

        <p>
          Produtos: <br />
          <span className="font-bold">
            {order.cesta.map((produto) => produto.nome).join(', ')}
          </span>
        </p>

        <div className="mt-2">
          <p>
            Subtotal:{' '}
            <span className="font-bold">{formatCurrency(order.subTotal)}</span>
          </p>
          <p>
            Valor total:{' '}
            <span className="font-bold">
              {formatCurrency(order.valorTotal)}
            </span>
          </p>
        </div>

        <div className="divider my-1"></div>

        <p>
          Forma de pagamento:{' '}
          <span className="font-bold">{order.formaPagamento}</span>
        </p>
        <p>
          Status: <span className="font-bold">{order.status}</span>
        </p>
        <p>
          Método de envio:{' '}
          <span className="font-bold">{order.metodoEnvio}</span>
        </p>

        {order.metodoEnvio === 'entrega' && order.enderecoEntrega && (
          <div className="mt-2 bg-base-200 p-2 rounded-md">
            <p>
              Endereço de entrega: <br />
              <span className="font-bold">
                CEP: {order.enderecoEntrega.CEP}
                {order.enderecoEntrega.bairro ? (
                  <>
                    <br />
                    {order.enderecoEntrega.bairro}
                  </>
                ) : (
                  ''
                )}
                {order.enderecoEntrega.numero
                  ? `, ${order.enderecoEntrega.numero}`
                  : ''}
              </span>
            </p>
          </div>
        )}
      </div>
    </article>
  );
}
