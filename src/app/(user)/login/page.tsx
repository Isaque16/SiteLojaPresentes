"use client";
import InputComponent from "@/components/InputComponent";
import ICustomer from "@/server/interfaces/ICustomer";
import { useRouter } from "next/router";
import { ChangeEvent, FormEvent, useState } from "react";

export default function Login() {
  const router = useRouter();
  
  const [formData, setFormData] = useState<Pick<ICustomer, "nome" | "senha">>({
    nome: "",
    senha: ""
  });

  function handleInput(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  }

  // Função para criar novo usuário (POST)
  async function lookForUser(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      const response = await fetch(`/api/client/${formData.nome}`);

      if (response.ok) router.replace("/catalogo");
      else throw new Error(`Erro ao criar produto: ${response.status}`);
    } catch (error) {
      console.error("Erro ao criar o produto:", error);
      throw error;
    }
  }

  return (
    <>
      <div className="text-3xl font-bold text-center p-10">
        <h1>Login</h1>
      </div>
      <div className="flex min-h-screen flex-col items-center">
        <form className="flex flex-col gap-10" onSubmit={lookForUser}>
          <InputComponent
            label="Nome"
            name="nome"
            type="text"
            value={formData.nome}
            placeholder="Seu nome"
            onChange={handleInput}
          />
          <InputComponent
            label="Senha"
            name="senha"
            type="password"
            value={formData.senha}
            placeholder="Sua senha"
            onChange={handleInput}
          />
          <button
            type="submit"
            className={`${Object.values(formData).some((value) => value === "") ? "btn btn-disabled" : "btn"}`}
          >
            Registrar
          </button>
        </form>
      </div>
    </>
  );
}
