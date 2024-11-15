"use client";

import InputComponent from "@/components/InputComponent";
import ICustomer from "@/interfaces/ICustomer";
import { setNomeUsuario } from "@/store/slices/userSlice";
// import LoadingSvg from "@/svg_components/LoadingSvg";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
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
  const router = useRouter();
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isValid, isSubmitting }
  } = useForm<ICustomer>({
    resolver: zodResolver(formDataSchema),
    mode: "onChange"
  });

  async function createUser(data: ICustomer) {
    try {
      const encodedNomeUsuario = encodeURIComponent(data.nomeUsuario);
      const userData = await fetch(`/api/cliente/${encodedNomeUsuario}`);
      const responseData: ICustomer = await userData.json();

      if (responseData?.nomeUsuario === data.nomeUsuario) {
        setError("nomeUsuario", { message: "Este nome já está em uso" });
        return;
      }

      const response = await fetch("/api/cliente", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });

      if (!response.ok)
        throw new Error("Erro ao criar o usuário, tente novamente.");

      const { nomeUsuario } = data;
      dispatch(setNomeUsuario({ nomeUsuario }));
      router.replace("/");
    } catch (error) {
      console.error("Erro ao criar o usuário:", error);
    }
  }

  return (
    <main className="flex flex-col items-center justify-center h-full md:h-screen pt-32">
      <div className="grid grid-cols-1 md:grid-cols-2 items-center justify-center shadow-md">
        <div className="flex flex-col items-center justify-center bg-base-200 h-full w-full rounded-tr-box rounded-tl-box md:rounded-tl-box md:rounded-bl-box md:rounded-tr-none">
          <h1 className="text-3xl font-bold text-center pt-10 pb-2">
            Cadastre-se
          </h1>
          <div className="border-2 border-white w-1/6 mb-5"></div>
        </div>
        <div className="bg-base-100 p-10 w-full h-full rounded-bl-box rounded-br-box md:rounded-br-box md:rounded-tr-box md:rounded-bl-none">
          {errors.root?.message && (
            <p className="text-white alert alert-error font-medium mb-4">
              {errors.root.message}
            </p>
          )}
          <form
            className="form-control gap-5"
            onSubmit={handleSubmit(createUser)}
          >
            {["nomeCompleto", "nomeUsuario", "senha", "email", "telefone"].map(
              (field) => (
                <div key={field}>
                  <InputComponent
                    label={field.charAt(0).toUpperCase() + field.slice(1)}
                    name={field}
                    type={field === "senha" ? "password" : "text"}
                    placeholder={`Digite seu ${field}`}
                    register={register}
                  />
                  {errors[field as keyof ICustomer] && (
                    <p className="text-error py-2 w-full max-w-xs">
                      {errors[field as keyof ICustomer]?.message}
                    </p>
                  )}
                </div>
              )
            )}
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
                "Registrar"
              )}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
