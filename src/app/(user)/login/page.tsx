"use client";
import InputComponent from "@/components/InputComponent";
import ICustomer from "@/interfaces/ICustomer";
import LoadingSvg from "@/svg_components/Loading";
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useState } from "react";

export default function Cadastro() {
  const router = useRouter();

  const [formData, setFormData] = useState<Pick<ICustomer, "nome" | "senha">>({
    nome: "",
    senha: ""
  });
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");

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
  async function loginUser(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoadingUsers(true);
    try {
      if (!(await someUserNames())) {
        setResponseMessage("Nome ou senha incorreto");
        setFormData({
          nome: "",
          senha: ""
        });
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
          <h1>Login</h1>
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
              onChange={handleInput}
            />
            <InputComponent
              label="Senha"
              name="senha"
              type="password"
              value={formData.senha}
              placeholder="Crie uma senha"
              onChange={handleInput}
            />
            <button
              type="submit"
              className={`text-xl ${
                Object.values(formData).some((value) => value === "")
                  ? "btn btn-disabled"
                  : "btn"
              }`}
            >
              {loadingUsers ? <LoadingSvg /> : "Login"}
            </button>
          </form>
        </div>
      </main>
    </>
  );
}
