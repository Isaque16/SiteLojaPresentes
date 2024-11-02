"use client";
import { ChangeEvent, useEffect, useState } from "react";
import InputComponent from "../../components/InputComponent";
import ProductCard from "@/components/ProductCard";
import IProduct from "@/server/interfaces/IProduct";

export default function StoreManager() {
  const [formData, setFormData] = useState<IProduct>({
    nome: "",
    categoria: "",
    preco: 0,
    quantidade: 0,
    descricao: "",
    imagem: "",
    nomeImagem: "",
  });

  const [products, setProducts] = useState<IProduct[]>([]);

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }

  // Função para criar novo produto (POST)
  async function createProduct() {
    try {
      const response = await fetch("/api/produtos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) 
        console.log("Produto criado com sucesso!");
      else
        throw new Error(`Erro ao criar produto: ${response.status}`);

    } catch (error) {
      console.error("Erro ao criar o produto:", error);
      throw error;
    }
  }

  // Função para atualizar produto existente (PUT)
  async function updateProduct(id: string) {
    try {
      const response = await fetch(`/api/produtos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) 
        console.log("Produto atualizado com sucesso!");
      else
        throw new Error(`Erro ao atualizar produto: ${response.status}`);

    } catch (error) {
      console.error("Erro ao atualizar o produto:", error);
      throw error;
    }
  }

  // Função principal de envio do formulário
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      if (formData._id) await updateProduct(formData._id); // Tenta atualizar se um id já estiver no formData
      else await createProduct(); // Caso contrário, cria um novo produto

      // Limpa o formulário e atualiza a lista de produtos
      setFormData({
        nome: "",
        categoria: "",
        preco: 0,
        quantidade: 0,
        descricao: "",
        imagem: "",
        nomeImagem: "",
      });

      fetchProducts(); // Atualiza a lista de produtos após criar/atualizar

    } catch (error) {
      console.error("Erro ao enviar o formulário:", error);
      alert("Erro ao enviar o formulário! Tente novamente.");
    }
  }

  // Função para buscar os produtos
  async function fetchProducts(): Promise<void> {
    try {
      const response = await fetch("/api/produtos");
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error(error);
      setProducts([]);
    }
  }

  // useEffect para buscar os produtos ao carregar o componente
  useEffect(() => {
    fetchProducts();
  }, []);

  function verifyInput(): boolean {
    const isEmpty = Object.values(formData).some((value) => value === "");
    return isEmpty;
  }

  function handleSelection(id: string): void {
    const selectedCard = products.find(prod => prod._id === id);
    if (selectedCard) {
      setFormData({
        _id: selectedCard._id,
        nome: selectedCard.nome,
        categoria: selectedCard.categoria,
        preco: selectedCard.preco,
        quantidade: selectedCard.quantidade,
        descricao: selectedCard.descricao,
        imagem: selectedCard.imagem,
        nomeImagem: selectedCard.nomeImagem,
      });
    }
  }

  return (
    <>
      <h1 className="text-3xl font-bold text-center p-10">
        Gerenciador de Estoque
      </h1>
      <main className="flex flex-col">
        <div className="flex min-h-screen flex-row items-center justify-around">
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col items-start p-5 gap-5">
              <InputComponent
                label="Nome"
                name="nome"
                type="text"
                placeholder="Nome do produto"
                value={formData.nome}
                onChange={handleChange}
              />
              <InputComponent
                label="Categoria"
                name="categoria"
                type="text"
                placeholder="Categoria do produto"
                value={formData.categoria}
                onChange={handleChange}
              />
              <InputComponent
                label="Preço"
                name="preco"
                type="number"
                placeholder="Preço do produto"
                value={formData.preco.toString()}
                onChange={handleChange}
              />
              <InputComponent
                label="Quantidade"
                name="quantidade"
                type="number"
                placeholder="Quantidade do produto"
                value={formData.quantidade.toString()}
                onChange={handleChange}
              />
              <InputComponent
                label="Descrição"
                name="descricao"
                type="text"
                placeholder="Descrição do produto"
                value={formData.descricao}
                onChange={handleChange}
              />
              <InputComponent
                label="Imagem"
                name="imagem"
                type="text"
                placeholder="Caminho da imagem"
                value={(formData.imagem = "https://picsum.photos/400/225")}
                onChange={handleChange}
              />
              <InputComponent
                label="Nome da imagem"
                name="nomeImagem"
                type="text"
                placeholder="Nome do produto"
                value={formData.nomeImagem}
                onChange={handleChange}
              />
              <button
                type="submit"
                className={`${verifyInput() ? "btn btn-disabled" : "btn"}`}
              >
                Registrar
              </button>
            </div>
          </form>
          <div className="grid grid-col-1 gap-5 w-fit h-fit overflow-y-scroll min-w-96 max-h-screen border-2 border-white rounded-lg p-10">
            {products.map((product) => (
              <ProductCard
                key={product._id}
                imagePath={product.imagem}
                imageAlt={product.nomeImagem}
                productTitle={product.nome}
                productDescription={product.descricao}
                productPrice={`R$ ${product.preco.toString()}`}
                id={product._id!}
                onClick={() => handleSelection(product._id!)}
              />
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
