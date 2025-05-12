"use client";
import { useState, useEffect } from "react";
import { z } from "zod";
import { getCookie } from "cookies-next/client";
import trpc from "@/trpc/client/trpc";
import { IAddress } from "@/interfaces";
import {
  ThemePreferences,
  PersonalDataForm,
  PasswordChangeForm,
  AddressManagement
} from "./components";
import { FeedbackProps } from "./components/FeedbackMessage";

const addressSchema = z.object({
  CEP: z.string().min(1, "CEP é obrigatório"),
  estado: z.string().min(2, "Estado precisa ter pelo menos 2 caracteres"),
  cidade: z.string().min(3, "Cidade precisa ter pelo menos 3 caracteres"),
  bairro: z.string().min(3, "Bairro precisa ter pelo menos 3 caracteres"),
  rua: z.string().min(3, "Rua precisa ter pelo menos 3 caracteres"),
  numero: z.string().min(1, "Número é obrigatório"),
  complemento: z.string().optional()
});

export default function UserConfiguration() {
  const userId = getCookie("id");
  const { data, refetch } = trpc.customers.getById.useQuery(userId as string, {
    enabled: !!userId
  });

  // Estado para mensagens de feedback
  const [feedback, setFeedback] = useState({
    personal: { message: "", type: "" },
    password: { message: "", type: "" },
    address: { message: "", type: "" }
  });

  // Limpar feedback após um tempo
  useEffect(() => {
    const timer = setTimeout(() => {
      setFeedback({
        personal: { message: "", type: "" },
        password: { message: "", type: "" },
        address: { message: "", type: "" }
      });
    }, 5000);

    return () => clearTimeout(timer);
  }, [feedback]);

  const { mutateAsync: saveUserData } = trpc.customers.save.useMutation({
    onSuccess: () => refetch()
  });

  const updatePersonalData = async (userData: {
    username: string;
    email: string;
  }) => {
    try {
      await saveUserData({
        ...data!,
        nomeUsuario: userData.username,
        email: userData.email
      });

      setFeedback((prev) => ({
        ...prev,
        personal: { message: "Dados atualizados com sucesso", type: "success" }
      }));
    } catch {
      setFeedback((prev) => ({
        ...prev,
        personal: { message: "Erro ao atualizar dados", type: "error" }
      }));
    }
  };

  const updatePassword = async (passwords: {
    current: string;
    new: string;
    confirm: string;
  }) => {
    const isPasswordValid =
      passwords.new &&
      passwords.new !== passwords.current &&
      passwords.new === passwords.confirm;

    if (isPasswordValid) {
      try {
        await saveUserData({ ...data!, senha: passwords.new });
        setFeedback((prev) => ({
          ...prev,
          password: {
            message: "Senha atualizada com sucesso!",
            type: "success"
          }
        }));
        return true;
      } catch {
        setFeedback((prev) => ({
          ...prev,
          password: { message: "Erro ao atualizar senha", type: "error" }
        }));
        return false;
      }
    } else {
      setFeedback((prev) => ({
        ...prev,
        password: { message: "Senhas não conferem ou inválidas", type: "error" }
      }));
      return false;
    }
  };

  const saveAddress = async (address: IAddress) => {
    try {
      await saveUserData({ ...data!, endereco: address });
      setFeedback((prev) => ({
        ...prev,
        address: {
          message: "Endereço atualizado com sucesso!",
          type: "success"
        }
      }));
      return true;
    } catch {
      setFeedback((prev) => ({
        ...prev,
        address: { message: "Erro ao atualizar endereço", type: "error" }
      }));
      return false;
    }
  };

  const setFeedbackFor = (type: "personal" | "password" | "address") => {
    return (feedbackProps: FeedbackProps) => {
      setFeedback((prev) => ({ ...prev, [type]: feedbackProps }));
    };
  };

  return (
    <main className="flex flex-col items-center p-5">
      <header className="flex flex-col items-center">
        <h1 className="text-4xl font-bold text-center pt-10 pb-2">
          Configurações do Perfil
        </h1>
        <div className="border-2 border-white md:w-1/6 w-1/2 mb-5"></div>
      </header>

      <ThemePreferences
        onFeedback={setFeedbackFor("personal")}
        feedback={feedback.personal}
      />

      <PersonalDataForm
        userData={{
          username: data?.nomeUsuario || "",
          email: data?.email || ""
        }}
        onSave={updatePersonalData}
        feedback={feedback.personal}
      />

      <PasswordChangeForm
        currentPassword={data?.senha || ""}
        onSave={updatePassword}
        feedback={feedback.password}
      />

      <AddressManagement
        address={data?.endereco}
        onSave={saveAddress}
        feedback={feedback.address}
        schema={addressSchema}
      />
    </main>
  );
}
