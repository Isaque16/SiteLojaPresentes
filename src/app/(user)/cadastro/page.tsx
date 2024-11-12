"use client";
import InputComponent from "@/components/InputComponent";
import ICustomer from "@/interfaces/ICustomer";
import LoadingSvg from "@/svg_components/LoadingSvg";
import someUserNames from "@/utils/someUserName";
import { zodResolver } from "@hookform/resolvers/zod";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formDataSchema = z.object({
  _id: z.string().optional(),
  nomeCompleto: z.string().min(3, "O nome precisa ter pelo menos 3 caracteres"),
  nomeUsuario: z
    .string()
    .min(3, "O nome de usuário precisa ter pelo menos 3 caracteres"),
  senha: z.string().min(6, "A senha precisa ter pelo menos 6 caracteres"),
  email: z.string().email("Email inválido"),
  telefone: z.string().min(11, "O telefone deve ter pelo menos 11 dígitos")
});

export default function Cadastro() {
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isValid, isSubmitting }
  } = useForm<ICustomer>({
    resolver: zodResolver(formDataSchema),
    mode: "onChange"
  });
  const [isCreatingUser, setIsCreatingUser] = useState<boolean>(false);
  useEffect(() => {
    setIsCreatingUser(isSubmitting);
  }, [isSubmitting]);

  async function createUser(data: ICustomer) {
    const userExists = await someUserNames(data.nomeUsuario);
    try {
      if (userExists) {
        setError("nomeUsuario", { message: "Este nome já está em uso" });
        reset({ nomeUsuario: "" });
        return;
      }

      await fetch("/api/cliente", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });

      redirect("/");
    } catch (error) {
      console.error("Erro ao criar o produto:", error);
      setError("nomeUsuario", {
        message: "Erro ao criar o usuário, tente novamente."
      });
    }
  }

  return (
    <main>
      <div className="text-3xl font-bold text-center p-10">
        <h1>Cadastre-se</h1>
      </div>
      <div className="flex min-h-screen flex-col items-center">
        <form
          className="flex flex-col gap-5"
          onSubmit={handleSubmit(createUser)}
        >
          {["nomeCompleto", "nomeUsuario", "senha", "email", "telefone"].map(
            (field, index) => (
              <div key={index}>
                <InputComponent
                  label={field.charAt(0).toUpperCase() + field.slice(1)}
                  name={field}
                  type={field === "senha" ? "password" : "text"}
                  placeholder={`Digite seu ${field}`}
                  register={register}
                />
                {errors[field as keyof ICustomer] && (
                  <p className="text-error py-2">
                    {errors[field as keyof ICustomer]?.message}
                  </p>
                )}
              </div>
            )
          )}

          <button
            type="submit"
            className={`text-xl btn ${!isValid && "btn-disabled"}`}
            disabled={!isValid}
          >
            {isCreatingUser ? <LoadingSvg /> : "Registrar"}
          </button>
        </form>
      </div>
    </main>
  );
}
