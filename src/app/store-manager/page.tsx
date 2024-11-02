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

  // Função para enviar o formulário
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      const response = await fetch("/api/produtos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setFormData({
          nome: "",
          categoria: "",
          preco: 0,
          quantidade: 0,
          descricao: "",
          imagem: "",
          nomeImagem: "",
        });

        fetchProducts(); // Atualiza a lista de produtos após adicionar
      } else throw new Error("Erro ao criar produto!: " + response.status);
    } catch (error) {
      throw new Error("Erro ao criar produto!: " + error);
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
    const selectedCard = products.find((prod) => prod._id === id);
    if (selectedCard) {
      setFormData({
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
