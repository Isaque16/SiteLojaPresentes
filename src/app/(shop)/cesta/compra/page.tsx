"use client";
import InputComponent from "@/components/InputComponent";
import ProductCardBasket from "@/components/ProductCardBasket";
import EFormaPagamento from "@/interfaces/EFormaPagamento";
import EStatus from "@/interfaces/EStatus";
import IAddress from "@/interfaces/IAdress";
import ICustomer from "@/interfaces/ICustomer";
import IOrder from "@/interfaces/IOrder";
import { clearBasket } from "@/store/slices/basketSlice";
import { RootState } from "@/store/store";
import trpc from "@/trpc/client/trpc";
import { zodResolver } from "@hookform/resolvers/zod";
import { getCookie } from "cookies-next";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { z } from "zod";

const formDataSchema = z.object({
  CEP: z.string(),
  estado: z.string().min(3, "Precisa ter pelo menos 3 caracteres"),
  cidade: z.string().min(3, "Precisa ter pelo menos 3 caracteres"),
  bairro: z.string().min(6, "Precisa ter pelo menos 6 caracteres"),
  rua: z.string().min(3, "Precisa ter pelo menos 3 caracteres"),
  numero: z.string().min(1, "Deve ter pelo menos 11 dígitos"),
  complemento: z.string().optional()
});

export default function Compra() {
  const router = useRouter();

  const userId = getCookie("id");
  const { data } = trpc.customers.getByName.useQuery(userId as string);

  const cesta = useSelector((state: RootState) => state.basket);
  const dispatch = useDispatch();

  const { mutate: saveOrder } = trpc.orders.save.useMutation({
    onSuccess: (data) => {
      dispatch(clearBasket());
      router.push(`/cesta/compra/comprado/${data?._id}`);
    }
  });
  const { mutateAsync: saveCustomerAdress } = trpc.customers.save.useMutation();

  const {
    register,
    getValues,
    formState: { errors }
  } = useForm<IAddress>({
    resolver: zodResolver(formDataSchema),
    mode: "onChange"
  });

  const [entrega, setEntrega] = useState<string>("sem_entrega");
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [pagamento, setPagamento] = useState<string>("pix");

  async function sendCreatOrder() {
    const customersOrder: IOrder = {
      cliente: data as ICustomer,
      cesta: cesta.items,
      subTotal: cesta.totalValue,
      valorFrete: 10,
      valorTotal: cesta.totalValue + 10,
      status: EStatus.PENDENTE,
      formaPagamento:
        EFormaPagamento[pagamento as keyof typeof EFormaPagamento],
      dataPedido: new Date(),
      metodoEnvio: entrega,
      enderecoEntrega: entrega == "entrega" ? getValues() : undefined
    };

    if (entrega == "entrega" && isSaved)
      await saveCustomerAdress({
        ...data!,
        endereco: customersOrder.enderecoEntrega
      });

    // Checkout com Stripe

    saveOrder(customersOrder);
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
                checked={entrega === "sem_entrega"}
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
                checked={entrega === "entrega"}
                onChange={(e) => setEntrega(e.target.value)}
              />
            </div>
          </div>
          {entrega === "entrega" ? (
            <form>
              {[
                "CEP",
                "estado",
                "cidade",
                "bairro",
                "rua",
                "numero",
                "complemento"
              ].map((field) => (
                <div key={field}>
                  <InputComponent
                    label={field.charAt(0).toUpperCase() + field.slice(1)}
                    name={field}
                    type={field === "numero" ? "number" : "text"}
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
            "Endereço da loja"
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
