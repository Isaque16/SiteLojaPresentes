"use client";
import IAddress from "@/interfaces/IAdress";
import trpc from "@/trpc/client/trpc";
import { zodResolver } from "@hookform/resolvers/zod";
import { setCookie, getCookie } from "cookies-next/client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export default function UserConfiguration() {
  const userId = getCookie("id");
  const { data, refetch } = trpc.customers.getById.useQuery(userId as string);

  const [responseMessage, setResponseMessage] = useState(["", "", ""]);
  useEffect(() => {
    setTimeout(() => {
      setResponseMessage((prev) => {
        const newArray = [...prev];
        newArray.fill("");
        return newArray;
      });
    }, 5000);
  }, [responseMessage]);

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
  const { mutateAsync: saveUserData } = trpc.customers.save.useMutation({
    onSuccess: () => refetch()
  });
  const [usuario, setUsuario] = useState<string>(data?.nomeUsuario ?? "");
  const [email, setEmail] = useState<string>(data?.email ?? "");

  async function sendEditedUserData(newNomeUsuario: string, newEmail: string) {
    const newUserData = {
      ...data!,
      nomeUsuario: newNomeUsuario,
      email: newEmail
    };
    await saveUserData(newUserData);

    setResponseMessage((prev) => {
      const newArray = [...prev];
      newArray[0] = "Dados atualizados com sucesso";
      return newArray;
    });
  }

  // Alteração de senha
  const senhaAtual = data?.senha;
  const [newSenha, setNewSenha] = useState("");
  const [confirmNewSenha, setConfirmNewSenha] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const isValid =
    newSenha != "" && senhaAtual !== newSenha && newSenha === confirmNewSenha;

  const updateActualSenha = async () => {
    if (isValid) {
      await saveUserData({ ...data!, senha: newSenha });
      setResponseMessage((prev) => {
        const newArray = [...prev];
        newArray[1] = "Senha atualizada com sucesso!";
        return newArray;
      });
      setNewSenha("");
      setConfirmNewSenha("");
    } else {
      setResponseMessage((prev) => {
        const newArray = [...prev];
        newArray[1] = "Senha inválida";
        return newArray;
      });
      setNewSenha("");
      setConfirmNewSenha("");
    }
  };

  // Gerenciamento de Endereços
  const [showModal, setShowModal] = useState(false);
  const [endereco, setEndereco] = useState<IAddress>(
    data?.endereco ?? {
      CEP: "",
      estado: "",
      cidade: "",
      bairro: "",
      rua: "",
      numero: "",
      complemento: ""
    }
  );

  const formDataSchema = z.object({
    CEP: z.string(),
    estado: z.string().min(3, "Precisa ter pelo menos 3 caracteres"),
    cidade: z.string().min(3, "Precisa ter pelo menos 3 caracteres"),
    bairro: z.string().min(6, "Precisa ter pelo menos 6 caracteres"),
    rua: z.string().min(3, "Precisa ter pelo menos 3 caracteres"),
    numero: z.string().min(1, "Deve ter pelo menos 11 dígitos"),
    complemento: z.string().optional()
  });

  function EnderecoForm() {
    const {
      register,
      handleSubmit,
      reset,
      formState: { errors }
    } = useForm<IAddress>({
      resolver: zodResolver(formDataSchema),
      mode: "onChange",
      defaultValues: endereco
    });

    useEffect(() => {
      reset(endereco);
    }, [endereco, reset]);

    return (
      <form
        onSubmit={handleSubmit(async (adress) => {
          await saveUserData({ ...data!, endereco: adress });
          setResponseMessage((prev) => {
            const newArray = [...prev];
            newArray[2] = "Endereço atualizado com sucesso!";
            return newArray;
          });
          setShowModal(false);
        })}
      >
        {[
          "CEP",
          "estado",
          "cidade",
          "bairro",
          "rua",
          "numero",
          "complemento"
        ].map((field) => (
          <div key={field}>
            <label htmlFor={field} className="label">
              {field.charAt(0).toUpperCase() + field.slice(1)}
            </label>
            <input
              name={field}
              type={field === "numero" ? "number" : "text"}
              value={endereco[field as keyof IAddress] ?? ""}
              placeholder={`Digite seu ${field}`}
              onChange={(e) =>
                setEndereco({ ...endereco, [field]: e.target.value })
              }
              {...register}
              className="input input-bordered focus-within:ring-white focus-within:ring-2 w-full max-w-xs"
            />
            {errors[field as keyof IAddress] && (
              <p className="text-error py-2 w-full max-w-xs">
                {errors[field as keyof IAddress]?.message}
              </p>
            )}
          </div>
        ))}
        <button
          type="submit"
          className="btn btn-success w-fit m-2 text-xl text-white mt-5"
        >
          Salvar endereço
        </button>
      </form>
    );
  }

  // Sincronização dos valores de `data` com os estados
  useEffect(() => {
    setUsuario(data?.nomeUsuario ?? "");
    setEmail(data?.email ?? "");
    setEndereco(
      data?.endereco ?? {
        CEP: "",
        estado: "",
        rua: "",
        numero: "",
        bairro: "",
        cidade: "",
        complemento: ""
      }
    );
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
          <p className="text-error empty:hidden">{responseMessage[0]}</p>
        </div>
      </div>

      <div className="card card-body card-bordered shadow-md mb-5 w-full md:w-1/2">
        <h1 className="card-title">Alteração de Senha</h1>
        <div className="flex flex-col gap-2">
          <label className="label">Senha atual</label>
          <div className="flex flex-row justify-between input input-bordered">
            <input
              type={isVisible ? "text" : "password"}
              value={senhaAtual ?? ""}
              readOnly={true}
              className="input-disabled"
            />
            <button onClick={() => setIsVisible((value) => !value)}>
              {isVisible ? "Ocultar" : "Mostrar"}
            </button>
          </div>

          <label className="label">Nova senha</label>
          <input
            type="password"
            className="input input-bordered"
            placeholder="Nova Senha"
            value={newSenha}
            onChange={(e) => setNewSenha(e.target.value)}
          />

          <label className="label">Confirme a senha</label>
          <input
            type="password"
            className="input input-bordered"
            placeholder="Confirme a senha"
            value={confirmNewSenha}
            onChange={(e) => setConfirmNewSenha(e.target.value)}
          />

          <button onClick={updateActualSenha} className="btn btn-primary mt-2">
            Salvar Alterações
          </button>

          <p
            className={`${
              isValid ? "text-success" : "text-error"
            } mt-2 empty:hidden`}
            aria-live="polite"
          >
            {responseMessage[1]}
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
            <button
              onClick={() => setShowModal((value) => !value)}
              className="btn btn-natural"
            >
              Editar Endereço Atual
            </button>
          ) : (
            <button
              onClick={() => setShowModal((value) => !value)}
              className="btn btn-secondary"
            >
              Adicionar Endereço
            </button>
          )}
          <p className="text-success">{responseMessage[2]}</p>
        </div>
        {showModal && <EnderecoForm />}
      </div>
    </main>
  );
}
