"use client";
import InputComponent from "@/components/InputComponent";
import ICustomer from "@/interfaces/ICustomer";
import LoadingSvg from "@/svg_components/LoadingSvg";
import handleInput from "@/utils/handleInput";
import someUserNames from "@/utils/someUserName";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function Cadastro() {
  const router = useRouter();

  const [formData, setFormData] = useState<Pick<ICustomer, "nome" | "senha">>({
    nome: "",
    senha: ""
  });
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");

  // Função para criar novo usuário (POST)
  async function loginUser(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoadingUsers(true);
    const userExists = await someUserNames(formData.nome);
    try {
      if (!userExists) {
        setResponseMessage("Nome ou senha incorreto");
        setFormData({ nome: "", senha: "" });
        return;
      }

      router.replace("/");
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
          <h1>Bem vindo(a) de volta!</h1>
        </div>
        <div className="flex min-h-screen flex-col items-center">
          <p className="text-error">{responseMessage}</p>
          <form className="flex flex-col gap-5" onSubmit={loginUser}>
            <InputComponent
              label="Nome"
              name="nome"
              type="text"
              value={formData.nome}
              placeholder="Digite seu nome"
              onChange={(e) => handleInput(e, setFormData)}
            />
            <InputComponent
              label="Senha"
              name="senha"
              type="password"
              value={formData.senha}
              placeholder="Crie uma senha"
              onChange={(e) => handleInput(e, setFormData)}
            />
            <button
              type="submit"
              className={`text-xl btn ${
                Object.values(formData).some((value) => value === "") &&
                "btn btn-disabled"
              }`}
            >
              {loadingUsers ? <LoadingSvg /> : "Entrar"}
            </button>
          </form>
        </div>
      </main>
    </>
  );
}
