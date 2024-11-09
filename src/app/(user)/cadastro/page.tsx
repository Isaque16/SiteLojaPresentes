"use client";
import InputComponent from "@/components/InputComponent";
import ICustomer from "@/interfaces/ICustomer";
import LoadingSvg from "@/svg_components/Loading";
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useState } from "react";

export default function Cadastro() {
  const router = useRouter();

  const [formData, setFormData] = useState<
    Pick<ICustomer, "nome" | "senha" | "email" | "telefone" | "CEP">
  >({
    nome: "",
    senha: "",
    email: "",
    telefone: "",
    CEP: ""
  });
  const [loadingUsers, setLoadingUsers] = useState<boolean>(false);
  const [responseMessage, setResponseMessage] = useState<string[]>([""]);

  function handleInput(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  }

  async function someUserNames(): Promise<boolean> {
    const nome = encodeURIComponent(formData.nome);
    try {
      const response = await fetch(`/api/cliente/${nome}`);
      const responseData = await response.json();
      return responseData !== null;
    } catch (error) {
      console.error("Erro ao buscar usuário:", error);
      return true;
    }
  }

  // Função para criar novo usuário (POST)
  async function createUser(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoadingUsers(true);
    try {
      if (await someUserNames()) {
        setResponseMessage((prev) => [
          "Este nome já está em uso",
          ...prev.slice(1)
        ]);
        setFormData({
          ...formData,
          nome: ""
        });
        return;
      }
      const response = await fetch("/api/cliente", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (response.status) router.replace("/");
      else throw new Error(`Erro ao criar produto: ${response.status}`);
    } catch (error) {
      console.error("Erro ao criar o produto:", error);
      throw error;
    } finally {
      setLoadingUsers(false);
    }
  }

  return (
    <>
      <main>
        <div className="text-3xl font-bold text-center p-10">
          <h1>Cadastre-se</h1>
        </div>
        <div className="flex min-h-screen flex-col items-center">
          <form className="flex flex-col gap-5" onSubmit={createUser}>
            <InputComponent
              label="Nome"
              name="nome"
              type="text"
              value={formData.nome}
              placeholder="Digite seu nome"
              onChange={handleInput}
            />
            <p className="text-error">{responseMessage[0]}</p>
            <InputComponent
              label="Senha"
              name="senha"
              type="password"
              value={formData.senha}
              placeholder="Crie uma senha"
              onChange={handleInput}
            />
            <p className="text-error">{responseMessage[1]}</p>
            <InputComponent
              label="E-mail"
              name="email"
              type="text"
              value={formData.email}
              placeholder="Seu email"
              onChange={handleInput}
            />
            <p className="text-error">{responseMessage[2]}</p>
            <InputComponent
              label="Telefone"
              name="telefone"
              type="text"
              value={formData.telefone}
              placeholder="Seu telefone"
              onChange={handleInput}
            />
            <p className="text-error">{responseMessage[3]}</p>
            <InputComponent
              label="CEP"
              name="CEP"
              type="text"
              value={formData.CEP}
              placeholder="Seu CEP"
              onChange={handleInput}
            />
            <p className="text-error">{responseMessage[4]}</p>
            <button
              type="submit"
              className={`text-xl ${
                Object.values(formData).some((value) => value === "")
                  ? "btn btn-disabled"
                  : "btn"
              }`}
            >
              {loadingUsers ? <LoadingSvg /> : "Registrar"}
            </button>
          </form>
        </div>
      </main>
    </>
  );
}
