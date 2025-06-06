'use client';
import InputComponent from '@/components/InputComponent';
import { EmptyCartMessage, ProductCardBasket } from '@/components';
import {
  IOrder,
  ICustomer,
  IAddress,
  EStatus,
  EPaymentMethod
} from '@/interfaces';
import { useBasketStore, useOrderStore } from '@/store';
import trpc from '@/trpc/client/trpc';
import { getCookie } from 'cookies-next';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { object, pipe, optional, string, minLength } from 'valibot';
import { valibotResolver } from "@hookform/resolvers/valibot";

const formDataSchema = object({
  CEP: string(),
  estado: pipe(string(), minLength(3, 'Precisa ter pelo menos 3 caracteres')),
  cidade: pipe(string(), minLength(3, 'Precisa ter pelo menos 3 caracteres')),
  bairro: pipe(string(), minLength(6, 'Precisa ter pelo menos 6 caracteres')),
  rua: pipe(string(), minLength(3, 'Precisa ter pelo menos 3 caracteres')),
  numero: pipe(string(), minLength(1, 'Deve ter pelo menos 11 dígitos')),
  complemento: optional(string())
});

export default function Compra() {
  const router = useRouter();

  const userId = getCookie('id');
  const { data } = trpc.customers.getById.useQuery(userId as string);

  const { items, quantities, totalValue, clearBasket } = useBasketStore();
  const { setOrder } = useOrderStore();

  const { mutate: saveOrder } = trpc.orders.save.useMutation({
    onSuccess: (data) => {
      clearBasket();
      router.push(`/cesta/compra/comprado/${data?._id}`);
    }
  });
  const { mutateAsync: saveCustomerAdress } = trpc.customers.save.useMutation();

  const {
    register,
    getValues,
    formState: { errors }
  } = useForm<IAddress>({
    resolver: valibotResolver(formDataSchema),
    mode: 'onChange'
  });

  const [entrega, setEntrega] = useState<string>('sem_entrega');
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [pagamento, setPagamento] = useState<string>('pix');

  async function sendCreatOrder() {
    const customersOrder: IOrder = {
      cliente: data as ICustomer,
      cesta: items,
      quantidades: quantities,
      subTotal: totalValue,
      valorFrete: 10,
      valorTotal: totalValue + 10,
      status: EStatus.PENDENTE,
      formaPagamento: EPaymentMethod[pagamento as keyof typeof EPaymentMethod],
      dataPedido: new Date(),
      metodoEnvio: entrega,
      enderecoEntrega: entrega == 'entrega' ? getValues() : undefined
    };

    if (entrega == 'entrega' && isSaved)
      await saveCustomerAdress({
        ...data!,
        endereco: customersOrder.enderecoEntrega
      });

    // Checkout com Stripe
    setOrder(customersOrder);
    saveOrder(customersOrder);
  }

  function cancelOrder() {
    clearBasket();
    router.replace('/catalogo');
  }

  return items.length == 0 ? (
    <EmptyCartMessage />
  ) : (
    <main className="card card-body p-5">
      <div>
        <h1 className="text-center text-3xl font-bold pt-20">
          Finalização da compra
        </h1>
      </div>
      <div className="card card-body card-bordered shadow-md">
        <h1 className="card-title text-2xl">
          Entrega para {data?.nomeCompleto}
        </h1>
        <div className="flex flex-col justify-center gap-2">
          <div className="flex flex-row gap-5">
            <div className="flex flex-row items-center">
              <label className="label" htmlFor="sem_entrega">
                Pegar na loja
              </label>
              <input
                className="radio radio-xs radio-primary"
                type="radio"
                name="entrega"
                id="sem_entrega"
                value="sem_entrega"
                checked={entrega === 'sem_entrega'}
                onChange={(e) => setEntrega(e.target.value)}
              />
            </div>
            <div className="flex flex-row items-center">
              <label className="label" htmlFor="entrega">
                Delivery
              </label>
              <input
                className="radio radio-xs radio-primary"
                type="radio"
                name="entrega"
                id="entrega"
                value="entrega"
                checked={entrega === 'entrega'}
                onChange={(e) => setEntrega(e.target.value)}
              />
            </div>
          </div>
          {entrega === 'entrega' ? (
            <form>
              {[
                'CEP',
                'estado',
                'cidade',
                'bairro',
                'rua',
                'numero',
                'complemento'
              ].map((field) => (
                <div key={field}>
                  <InputComponent
                    label={field.charAt(0).toUpperCase() + field.slice(1)}
                    name={field}
                    type={field === 'numero' ? 'number' : 'text'}
                    placeholder={`Digite seu ${field}`}
                    register={register}
                  />
                  {errors[field as keyof IAddress] && (
                    <p className="text-error py-2 w-full max-w-xs">
                      {errors[field as keyof IAddress]?.message}
                    </p>
                  )}
                </div>
              ))}
              <div className="flex flex-row items-center gap-2 mt-5">
                <input
                  type="checkbox"
                  name="save"
                  id="save"
                  className="checkbox"
                  checked={isSaved}
                  onChange={(e) => setIsSaved(e.target.checked)}
                />
                <label htmlFor="save">Salvar para compras futuras</label>
              </div>
            </form>
          ) : (
            'Endereço da loja'
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
        {items.map((item, index) => (
          <ProductCardBasket key={item._id} item={item} index={index} />
        ))}
      </div>
      <div>
        <div>
          <p className="text-xl">
            {quantities.reduce((acc, cur) => acc + cur, 0)} Itens
          </p>
          <p className="text-xl">
            Frete e manuseio: <span className="text-sm">R$</span>10
          </p>
          <p className="text-xl">
            Total do pedido: <span className="text-sm">R$</span>
            {totalValue}
          </p>
        </div>
        <div className="flex flex-row gap-5 py-5">
          <button
            onClick={sendCreatOrder}
            className="btn btn-success w-fit m-2 text-xl text-white"
          >
            Confirmar pedido
          </button>
          <button
            onClick={cancelOrder}
            className="btn btn-error w-fit m-2 text-xl text-white"
          >
            Cancelar pedido
          </button>
        </div>
      </div>
    </main>
  );
}
