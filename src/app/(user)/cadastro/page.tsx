"use client";
import InputComponent from "@/components/InputComponent";
import ICustomer from "@/interfaces/ICustomer";
import LoadingSvg from "@/svg_components/LoadingSvg";
import handleInput from "@/utils/handleInput";
import someUserNames from "@/utils/someUserName";
import { useRouter } from "next/navigation";
import { FormEvent, useState, useMemo } from "react";

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
  const [responseMessage, setResponseMessage] = useState<{
    [key: string]: string;
  }>({
    nome: "",
    senha: "",
    email: "",
    telefone: "",
    CEP: ""
  });

  const isFormValid = useMemo(
    () => Object.values(formData).every((value) => value !== ""),
    [formData]
  );

  // Função para criar novo usuário (POST)
  async function createUser(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoadingUsers(true);

    const userExists = await someUserNames(formData.nome);
    try {
      if (userExists) {
        setResponseMessage((prev) => ({
          ...prev,
          nome: "Este nome já está em uso"
        }));
        setFormData((prev) => ({ ...prev, nome: "" }));
        return;
      }

      const response = await fetch("/api/cliente", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (response.ok) router.replace("/");
      else throw new Error(`Erro ao criar produto: ${response.status}`);
    } catch (error) {
      console.error("Erro ao criar o produto:", error);
      setResponseMessage((prev) => ({
        ...prev,
        nome: "Erro ao criar o usuário, tente novamente."
      }));
    } finally {
      setLoadingUsers(false);
    }
  }

  return (
    <main>
      <div className="text-3xl font-bold text-center p-10">
        <h1>Cadastre-se</h1>
      </div>
      <div className="flex min-h-screen flex-col items-center">
        <form className="flex flex-col gap-5" onSubmit={createUser}>
          {(
            [
              "nome",
              "senha",
              "email",
              "telefone",
              "CEP"
            ] as (keyof typeof formData)[]
          ).map((field, index) => (
            <div key={index}>
              <InputComponent
                label={field.charAt(0).toUpperCase() + field.slice(1)}
                name={field}
                type={field === "senha" ? "password" : "text"}
                value={formData[field]}
                placeholder={`Digite seu ${field}`}
                onChange={(e) => handleInput(e, setFormData)}
              />
              <p className="text-error">{responseMessage[field]}</p>
            </div>
          ))}

          <button
            type="submit"
            className={`text-xl btn ${!isFormValid && "btn-disabled"}`}
            disabled={!isFormValid}
          >
            {loadingUsers ? <LoadingSvg /> : "Registrar"}
          </button>
        </form>
      </div>
    </main>
  );
}
