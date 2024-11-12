"use client";
import InputComponent from "@/components/InputComponent";
import ICustomer from "@/interfaces/ICustomer";
import LoadingSvg from "@/svg_components/LoadingSvg";
import someUserNames from "@/utils/someUserName";
import { zodResolver } from "@hookform/resolvers/zod";
import { redirect } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formDataSchema = z.object({
  nomeUsuario: z
    .string()
    .min(3, "O nome de usuário precisa ter pelo menos 3 caracteres"),
  senha: z.string().min(6, "A senha precisa ter pelo menos 6 caracteres")
});

type LoginType = Pick<ICustomer, "nomeUsuario" | "senha">;

export default function Cadastro() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid }
  } = useForm<LoginType>({
    resolver: zodResolver(formDataSchema),
    mode: "onChange"
  });
  const [isLoginUser, setIsLoginUser] = useState<boolean>(false);

  async function loginUser(data: LoginType) {
    setIsLoginUser(true);

    const userExists = await someUserNames(data.nomeUsuario);
    try {
      if (!userExists) {
        errors.root!.message = "Usuário não encontrado";
        reset();
        return;
      }

      redirect("/");
    } catch (error) {
      console.error("Erro ao criar o produto:", error);
      errors.root!.message = "Erro ao logar usuário, tente novamente.";
    } finally {
      setIsLoginUser(false);
    }
  }

  return (
    <main>
      <div className="text-3xl font-bold text-center p-10">
        <h1>Login</h1>
      </div>
      <div className="flex min-h-screen flex-col items-center">
        <p className="text-error">{errors.root?.message}</p>
        <form
          className="flex flex-col gap-5"
          onSubmit={handleSubmit(loginUser)}
        >
          {["nomeUsuario", "senha"].map((field, index) => (
            <div key={index}>
              <InputComponent
                label={field.charAt(0).toUpperCase() + field.slice(1)}
                name={field}
                type={field === "senha" ? "password" : "text"}
                placeholder={`Digite seu ${field}`}
                register={register}
              />
            </div>
          ))}

          <button
            type="submit"
            className={`text-xl btn ${!isValid && "btn-disabled"}`}
            disabled={!isValid}
          >
            {isLoginUser ? <LoadingSvg /> : "Registrar"}
          </button>
        </form>
      </div>
    </main>
  );
}
