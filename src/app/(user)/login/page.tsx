"use client";

import InputComponent from "@/components/InputComponent";
import ICustomer from "@/interfaces/ICustomer";
import { setNomeUsuario } from "@/store/slices/userSlice";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { z } from "zod";

const formDataSchema = z.object({
  nomeUsuario: z
    .string()
    .min(3, "O nome de usuário precisa ter pelo menos 3 caracteres"),
  senha: z.string().min(6, "A senha precisa ter pelo menos 6 caracteres")
});

type LoginType = { nomeUsuario: string; senha: string };

export default function Cadastro() {
  const router = useRouter();
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isValid, isSubmitting }
  } = useForm<LoginType>({
    resolver: zodResolver(formDataSchema),
    mode: "onChange"
  });

  async function loginUser({ nomeUsuario, senha }: LoginType) {
    try {
      const encodedNomeUsuario = encodeURIComponent(nomeUsuario);
      const userData = await fetch(`/api/cliente/${encodedNomeUsuario}`);
      const responseData: ICustomer = await userData.json();

      const doesUserExist =
        responseData?.nomeUsuario === nomeUsuario &&
        responseData?.senha === senha;

      if (!doesUserExist) {
        reset();
        setError("root", { message: "Usuário ou senha incorreto" });
        return;
      }

      dispatch(setNomeUsuario({ nomeUsuario }));
      router.replace("/");
    } catch (error) {
      console.error("Erro ao logar o usuário:", error);
      setError("root", { message: "Erro ao logar usuário, tente novamente." });
    }
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen">
      <div className="p-10">
        <h1 className="text-3xl font-bold text-center">Login</h1>
      </div>
      <form className="flex flex-col gap-5" onSubmit={handleSubmit(loginUser)}>
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
        <p className="text-white alert alert-error text-xl empty:hidden">
          {errors.root?.message}
        </p>

        <button
          type="submit"
          className={`text-xl btn ${
            !isValid || isSubmitting ? "btn-disabled" : ""
          }`}
          disabled={!isValid || isSubmitting}
        >
          {isSubmitting ? (
            <div className="loading loading-dots loading-lg"></div>
          ) : (
            "Entrar"
          )}
        </button>
      </form>
    </main>
  );
}
