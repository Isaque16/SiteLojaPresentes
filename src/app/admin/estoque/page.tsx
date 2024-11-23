"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import InputComponent from "@/components/InputComponent";
import ProductCard from "@/components/ProductCard";
import IProduct from "@/interfaces/IProduct";
import LoadingProducts from "./loading";
import { z } from "zod";
import trpc from "@/trpc/client/trpc";

const formDataSchema = z.object({
  _id: z.string().optional().readonly(),
  nome: z.string().min(3, "O nome precisa ter pelo menos 3 caracteres"),
  categoria: z
    .string()
    .min(3, "A categoria precisa ter pelo menos 3 caracteres"),
  preco: z
    .string()
    .transform((val) => Number(val))
    .or(z.number().min(1, "O preço deve ser maior que 0")),
  quantidade: z
    .string()
    .transform((val) => Number(val))
    .or(z.number().min(1, "Deve haver ao menos 1 produto")),
  descricao: z.string(),
  imagem: z.string().url("URL da imagem inválida"),
  nomeImagem: z.string()
});

export default function StockManager() {
  const {
    data: products,
    isLoading: isLoadingProducts,
    refetch
  } = trpc.products.getAll.useQuery();

  const [responseMessage, setResponseMessage] = useState("");
  const showMessage = (message: string) => {
    setResponseMessage(message);
    setTimeout(() => setResponseMessage(""), 5000);
  };

  const { mutateAsync: saveProduct } = trpc.products.save.useMutation({
    onSuccess() {
      reset();
      refetch();
      showMessage("Estoque atualizado com sucesso!");
    }
  });

  const { mutate: deleteProduct } = trpc.products.delete.useMutation({
    onSuccess() {
      refetch();
      showMessage("Produto removido com sucesso!");
    }
  });

  const {
    register,
    handleSubmit,
    reset,
    trigger,
    formState: { errors, isValid }
  } = useForm<IProduct>({
    resolver: zodResolver(formDataSchema),
    mode: "onChange"
  });

  const editProduct = (id: string) => {
    const product = products?.find((prod) => prod._id === id);
    if (product) {
      reset(product);
      trigger();
    }
  };

  const fields = [
    { name: "nome", label: "Nome", type: "text" },
    { name: "categoria", label: "Categoria", type: "text" },
    { name: "preco", label: "Preço", type: "number" },
    { name: "quantidade", label: "Quantidade", type: "number" },
    { name: "descricao", label: "Descrição", type: "text" },
    { name: "imagem", label: "Imagem", type: "text" },
    { name: "nomeImagem", label: "Nome da Imagem", type: "text" }
  ];

  return (
    <main className="flex flex-col pt-16">
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold text-center pb-2">
          Gerenciador de Estoque
        </h1>
        <div className="border-2 border-white md:w-1/12 w-1/2 mb-5"></div>
      </div>
      <div className="flex min-h-screen flex-col md:flex-row items-center justify-around">
        <form onSubmit={handleSubmit((data) => saveProduct(data))}>
          <div className="flex flex-col items-start p-5 gap-5">
            {fields.map(({ name, label, type }) => (
              <div key={name}>
                <InputComponent
                  label={label}
                  name={name}
                  type={type}
                  placeholder={`Digite ${label.toLowerCase()}`}
                  register={register}
                />
                {errors[name as keyof IProduct] && (
                  <p className="text-error py-2">
                    {errors[name as keyof IProduct]?.message}
                  </p>
                )}
              </div>
            ))}
            <button
              type="submit"
              className={`text-xl btn ${!isValid && "btn-disabled"}`}
              disabled={!isValid}
            >
              Registrar
            </button>
            <p className="text-white alert alert-info font-bold empty:hidden">
              {responseMessage}
            </p>
          </div>
        </form>

        <div
          id="products_container"
          className="grid grid-col-1 gap-5 justify-center md:justify-normal md:w-96 w-full overflow-y-scroll overflow-x-hidden min-w-80 md:min-w-fit max-h-screen border-2 border-white rounded-lg p-10"
        >
          {isLoadingProducts ? (
            <LoadingProducts />
          ) : (
            products?.map((product) => (
              <div
                key={product._id}
                className="bg-base-300 py-2 rounded-box flex flex-col items-center justify-center gap-2"
              >
                <ProductCard
                  imagePath={product.imagem}
                  imageAlt={product.nomeImagem}
                  productTitle={product.nome}
                  productDescription={product.descricao}
                  productPrice={product.preco.toString()}
                  id={product._id!}
                />
                <div className="flex flex-row gap-5 mb-10 md:mb-0">
                  <button
                    onClick={() => editProduct(product._id!)}
                    className="btn btn-accent"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => deleteProduct(product._id!)}
                    className="btn btn-error"
                  >
                    Deletar
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
