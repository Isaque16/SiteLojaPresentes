"use client";
import { trpc } from "@/trpc/client/trpc";
import { setCookie, getCookie } from "cookies-next/client";
import React, { useEffect, useState } from "react";

export default function UserConfiguration() {
  const userId = getCookie("id");
  const { data, refetch } = trpc.customers.getById.useQuery(userId as string);
  const { mutate: saveUserData } = trpc.customers.save.useMutation({
    onSuccess() {
      refetch();
      setEditUserDataResponseMessage("");
    }
  });

  // Preferência de Temas
  const [theme, setTheme] = useState("escuro");
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    setTheme(mediaQuery.matches ? "escuro" : "claro");

    const handleChange = (e: MediaQueryListEvent) =>
      setTheme(e.matches ? "escuro" : "claro");

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  // Alteração de Dados Pessoais
  const [usuario, setUsuario] = useState<string>(data?.nomeUsuario ?? "");
  const [email, setEmail] = useState<string>(data?.email ?? "");
  const [editUserDataResponseMessage, setEditUserDataResponseMessage] =
    useState<string>("");

  async function sendEditedUserData(newNomeUsuario: string, newEmail: string) {
    const newUserData = {
      ...data!,
      nomeUsuario: newNomeUsuario,
      email: newEmail
    };
    saveUserData(newUserData);
  }

  // Gerenciamento de Endereços
  const [endereco, setEndereco] = useState(
    data?.endereco ?? { rua: "", numero: "", bairro: "", cidade: "" }
  );

  // Sincronização dos valores de `data` com os estados
  useEffect(() => {
    if (data) {
      setUsuario(data.nomeUsuario ?? "");
      setEmail(data.email ?? "");
      setEndereco(
        data.endereco ?? { rua: "", numero: "", bairro: "", cidade: "" }
      );
    }
  }, [data]);

  return (
    <main className="flex flex-col items-center p-5">
      <div className="flex flex-col items-center">
        <h1 className="text-4xl font-bold text-center pt-10 pb-2">
          Configurações do Perfil
        </h1>
        <div className="border-2 border-white md:w-1/6 w-1/2 mb-5"></div>
      </div>

      <div className="card card-body card-bordered shadow-md mb-5 w-full md:w-1/2">
        <h1 className="card-title">Preferências</h1>
        <form className="flex flex-col gap-2">
          <h2>Temas</h2>
          <div className="flex flex-row gap-2">
            <input
              type="radio"
              name="tema"
              id="claro"
              checked={theme === "claro"}
              value="claro"
              onChange={(e) => setTheme(e.target.value)}
            />
            <label htmlFor="claro" className="label">
              Claro
            </label>
          </div>
          <div className="flex flex-row gap-2">
            <input
              type="radio"
              name="tema"
              id="escuro"
              checked={theme === "escuro"}
              value="escuro"
              onChange={(e) => setTheme(e.target.value)}
            />
            <label htmlFor="escuro" className="label">
              Escuro
            </label>
          </div>
          <button
            onClick={() => setCookie("theme", theme)}
            className="btn btn-primary mt-2"
          >
            Salvar
          </button>
        </form>
      </div>

      <div className="card card-body card-bordered shadow-md mb-5 w-full md:w-1/2">
        <h1 className="card-title">Alteração de Dados Pessoais</h1>
        <div className="flex flex-col gap-2">
          <label className="label">Nome de Usuário</label>
          <input
            type="text"
            className="input input-bordered"
            placeholder="Seu usuário"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
          />
          <label className="label">E-mail</label>
          <input
            type="email"
            className="input input-bordered"
            placeholder="Seu e-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button
            onClick={() => sendEditedUserData(usuario, email)}
            className="btn btn-primary mt-2"
          >
            Salvar Alterações
          </button>
          <p className="text-error empty:hidden">
            {editUserDataResponseMessage}
          </p>
        </div>
      </div>

      <div className="card card-body card-bordered shadow-md mb-5 w-full md:w-1/2">
        <h1 className="card-title">Gerenciamento de Endereços</h1>
        <div className="flex flex-col gap-2">
          <p>
            {endereco
              ? `Endereço atual: ${endereco.rua}, ${endereco.numero} - ${endereco.bairro}, ${endereco.cidade}`
              : "Sem endereço"}
          </p>

          {endereco ? (
            <button className="btn btn-natural">Editar Endereço Atual</button>
          ) : (
            <button className="btn btn-secondary">Adicionar Endereço</button>
          )}
        </div>
      </div>
    </main>
  );
}
