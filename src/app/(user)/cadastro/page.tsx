"use client";
import InputComponent from "@/components/InputComponent";
import ICustomer from "@/interfaces/ICustomer";
import LoadingSvg from "@/svg_components/LoadingSvg";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
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
  const router = useRouter();
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
      router.replace("/");
    } catch (error: any) {
      console.error("Erro ao criar o usuário:", error);
      setError("root", { message: error.message || "Erro desconhecido." });
    }
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen">
      <div className="p-10">
        <h1 className="text-3xl font-bold text-center">Cadastre-se</h1>
      </div>
      <div className="flex flex-col items-center">
        {errors.root?.message && (
          <p className="text-white alert alert-error font-medium mb-4">
            {errors.root.message}
          </p>
        )}
        <form
          className="flex flex-col gap-5"
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
                  <p className="text-error py-2">
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
            {isSubmitting ? <LoadingSvg /> : "Registrar"}
          </button>
        </form>
      </div>
    </main>
  );
}
