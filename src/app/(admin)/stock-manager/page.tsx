"use client";
import { ChangeEvent, useEffect, useState } from "react";
import InputComponent from "../../../components/InputComponent";
import ProductCard from "@/components/ProductCard";
import IProduct from "@/interfaces/IProduct";
import LoadingProducts from "./loading";

export default function StoreManager() {
  const [formData, setFormData] = useState<IProduct>({
    _id: "",
    nome: "",
    categoria: "",
    preco: 0.0,
    quantidade: 0.0,
    descricao: "",
    imagem: "",
    nomeImagem: ""
  });
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loadingProducts, setLoadingProducts] = useState<boolean>(false);
  const [responseMessage, setResponseMessage] = useState<string>("");
  useEffect(() => {
    const timer = setTimeout(() => setResponseMessage(""), 5000);
    return () => clearTimeout(timer);
  }, [responseMessage]);

  function handleInput(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  }

  // Função principal de envio do formulário
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      if (formData._id)
        await updateProduct(); // Tenta atualizar se um id já estiver no formData
      else await createProduct(); // Caso contrário, cria um novo produto

      // Limpa o formulário e atualiza a lista de produtos
      setFormData({
        _id: "",
        nome: "",
        categoria: "",
        preco: 0.0,
        quantidade: 0.0,
        descricao: "",
        imagem: "",
        nomeImagem: ""
      });

      getProducts(); // Atualiza a lista de produtos após criar/atualizar
    } catch (error) {
      console.error("Erro ao enviar o formulário:", error);
    }
  }

  // Função para criar novo produto (POST)
  async function createProduct() {
    try {
      const response = await fetch("/api/produtos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const { message } = await response.json();
      if (response.ok) setResponseMessage(message);
      else throw new Error(`Erro ao criar produto: ${response.status}`);
    } catch (error) {
      console.error("Erro ao criar o produto:", error);
      throw error;
    }
  }

  // Função para atualizar produto existente (PUT)
  async function updateProduct() {
    try {
      const response = await fetch(`/api/produtos/`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const { message } = await response.json();
      if (response.ok) setResponseMessage(message);
      else throw new Error(`Erro ao atualizar produto: ${response.status}`);
    } catch (error) {
      console.error("Erro ao atualizar o produto:", error);
      throw error;
    }
  }

  // Função para buscar os produtos
  async function getProducts(): Promise<void> {
    setLoadingProducts(true);
    try {
      const response = await fetch("/api/produtos");
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error(error);
      setProducts([]);
    } finally {
      setLoadingProducts(false);
    }
  }
  useEffect(() => {
    getProducts();
  }, []);

  function editProduct(id: string): void {
    const selectedCard = products.find((prod) => prod._id === id);
    if (selectedCard) setFormData(selectedCard);
  }

  // Função para deletar um produto (DELETE)
  async function deleteProduct(id: string) {
    try {
      const response = await fetch(`/api/produtos/${id}`, {
        method: "DELETE"
      });

      const { message } = await response.json();
      if (response.ok) {
        getProducts();
        setResponseMessage(message);
      } else throw new Error(`Erro ao deletar produto: ${response.status}`);
    } catch (error) {
      console.error("Erro ao deletar o produto:", error);
    }
  }

  return (
    <>
      <h1 className="text-3xl font-bold text-center p-10">
        Gerenciador de Estoque
      </h1>
      <main className="flex flex-col">
        <div className="flex min-h-screen flex-col md:flex-row items-center justify-around">
          <form onSubmit={handleSubmit}>
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
                <InputComponent
                  key={field}
                  label={field.charAt(0).toUpperCase() + field.slice(1)}
                  name={field}
                  type={
                    field === "preco" || field === "quantidade"
                      ? "number"
                      : "text"
                  }
                  placeholder={`Digite ${field} do produto`}
                  value={formData[field as keyof IProduct]}
                  onChange={handleInput}
                />
              ))}
              <button
                type="submit"
                className={`${
                  Object.values(formData).some((value) => value === "")
                    ? "btn btn-disabled"
                    : "btn"
                }`}
              >
                Registrar
              </button>
              <div className="text-info font-bold">{responseMessage}</div>
            </div>
          </form>

          <div className="grid grid-col-1 gap-5 justify-center md:justify-normal md:w-96 w-80 h-fit overflow-y-scroll overflow-x-hidden min-w-80 md:min-w-fit max-h-screen border-2 border-white rounded-lg p-10">
            {loadingProducts ? (
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
                    productPrice={`R$ ${product.preco.toString()}`}
                    id={product._id!}
                  />
                  <div className="flex flex-row gap-5">
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
    </>
  );
}
