"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import InputComponent from "@/components/InputComponent";
import ProductCard from "@/components/ProductCard";
import IProduct from "@/interfaces/IProduct";
import LoadingProducts from "./loading";
import { z } from "zod";

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
    register,
    handleSubmit,
    reset,
    trigger,
    formState: { errors, isValid }
  } = useForm<IProduct>({
    resolver: zodResolver(formDataSchema),
    mode: "onChange"
  });
  const [products, setProducts] = useState<IProduct[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [responseMessage, setResponseMessage] = useState("");
  useEffect(() => {
    const timer = setTimeout(() => setResponseMessage(""), 5000);
    return () => clearTimeout(timer);
  }, [responseMessage]);

  // Função principal de envio do formulário
  async function onSubmit(data: IProduct) {
    try {
      if (data._id) await updateProduct(data); // Atualiza se tiver ID
      else await createProduct(data); // Cria um novo produto

      reset(); // Limpa o formulário
      fetchProducts(); // Atualiza a lista de produtos
    } catch (error) {
      console.error("Erro ao enviar o formulário:", error);
    }
  }

  // Função para criar novo produto (POST)
  async function createProduct(data: IProduct) {
    try {
      const response = await fetch("/api/produtos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      const { message } = await response.json();
      if (response.ok) setResponseMessage(message);
    } catch (error) {
      console.error("Erro ao criar o produto:", error);
      throw error;
    }
  }

  // Função para atualizar produto existente (PUT)
  async function updateProduct(data: IProduct) {
    try {
      const response = await fetch(`/api/produtos/`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      const { message } = await response.json();
      if (response.ok) setResponseMessage(message);
    } catch (error) {
      console.error("Erro ao atualizar o produto:", error);
      throw error;
    }
  }

  // Função para buscar os produtos
  async function fetchProducts(): Promise<void> {
    setIsLoadingProducts(true);
    try {
      const response = await fetch("/api/produtos");
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error(error);
      setProducts([]);
    } finally {
      setIsLoadingProducts(false);
    }
  }
  useEffect(() => {
    fetchProducts();
  }, []);

  function editProduct(id: string) {
    const selectedCard = products.find((prod) => prod._id === id);
    reset(selectedCard);
    trigger();
  }

  async function deleteProduct(id: string) {
    try {
      const response = await fetch(`/api/produtos/${id}`, {
        method: "DELETE"
      });
      const { message } = await response.json();
      if (response.ok) {
        fetchProducts();
        setResponseMessage(message);
      }
    } catch (error) {
      console.error("Erro ao deletar o produto:", error);
    }
  }

  return (
    <main className="flex flex-col pt-16">
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold text-center pt-10 pb-2">
          Gerenciador de Estoque
        </h1>
        <div className="border-2 border-white md:w-1/12 w-1/2 mb-5"></div>
      </div>
      <div className="flex min-h-screen flex-col md:flex-row items-center justify-around">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col items-start p-5 gap-5">
            {[
              "nome",
              "categoria",
              "preco",
              "quantidade",
              "descricao",
              "imagem",
              "nomeImagem"
            ].map((field) => (
              <div key={field}>
                <InputComponent
                  label={field.charAt(0).toUpperCase() + field.slice(1)}
                  name={field}
                  type={
                    field === "preco" || field === "quantidade"
                      ? "number"
                      : "text"
                  }
                  placeholder={`Digite ${field} do produto`}
                  register={register}
                />
                {errors[field as keyof IProduct] && (
                  <p className="text-error py-2">
                    {errors[field as keyof IProduct]?.message}
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
            products.map((product) => (
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
