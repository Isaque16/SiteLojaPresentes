"use client";
import { InputComponent, useToast } from "@/components";
import { ICustomer } from "@/interfaces";
import { useUserStore } from "@/store";
import trpc from "@/trpc/client/trpc";
import { zodResolver } from "@hookform/resolvers/zod";
import { setCookie } from "cookies-next/client";
import Link from "next/link";
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
  const { setUserData } = useUserStore();
  const { showToast } = useToast();

  const {
    register,
    handleSubmit,
    getValues,
    setError,
    formState: { errors, isValid, isSubmitting }
  } = useForm<ICustomer>({
    resolver: zodResolver(formDataSchema),
    mode: "onChange"
  });

  const { refetch } = trpc.customers.getByName.useQuery(
    getValues().nomeUsuario,
    { enabled: false }
  );

  const { mutateAsync: saveCustomer } = trpc.customers.save.useMutation({
    onSuccess(data) {
      setUserData({
        _id: data?._id || "",
        nomeUsuario: data?.nomeUsuario || ""
      });
      setCookie("id", data?._id);
      showToast("Usuário criado com sucesso!", "success");
      router.replace("/");
    },
    onError(error) {
      showToast(error.message, "error");
    }
  });

  async function createUser(customerData: ICustomer) {
    const { data } = await refetch();
    if (data?.nomeUsuario === customerData.nomeUsuario) {
      setError("nomeUsuario", { message: "Este nome já está em uso" });
      return;
    }

    await saveCustomer(customerData);
  }

  const fields = [
    { name: "nomeCompleto", label: "Nome Completo", type: "text" },
    { name: "nomeUsuario", label: "Usuario", type: "text" },
    { name: "senha", label: "Senha", type: "password" },
    { name: "email", label: "Email", type: "text" },
    { name: "telefone", label: "Telefone", type: "text" }
  ];

  return (
    <main className="flex flex-col items-center justify-center h-full md:h-screen pt-10">
      <div className="grid grid-cols-1 md:grid-cols-2 items-center justify-center shadow-md">
        <div className="flex flex-col items-center justify-center bg-base-200 h-full w-full rounded-tr-box rounded-tl-box md:rounded-tl-box md:rounded-bl-box md:rounded-tr-none">
          <h1 className="text-3xl font-bold text-center pt-10 pb-2">
            Cadastre-se
          </h1>
          <div className="border-2 border-white w-1/6 mb-5"></div>
        </div>
        <div className="bg-base-100 p-10 w-full h-full rounded-bl-box rounded-br-box md:rounded-br-box md:rounded-tr-box md:rounded-bl-none">
          <form onSubmit={handleSubmit(createUser)}>
            {fields.map(({ name, label, type }) => (
              <div key={name} className="mb-2">
                <InputComponent
                  label={label}
                  name={name}
                  type={type}
                  placeholder={`Digite seu ${label}`}
                  register={register}
                />
                <div className="min-h-6">
                  {errors[name as keyof ICustomer] && (
                    <p className="text-error py-2 w-full max-w-xs">
                      {errors[name as keyof ICustomer]?.message}
                    </p>
                  )}
                </div>
              </div>
            ))}
            <button
              type="submit"
              className="text-xl btn"
              disabled={!isValid || isSubmitting}
            >
              {isSubmitting ? (
                <div className="loading loading-dots loading-lg"></div>
              ) : (
                "Registrar"
              )}
            </button>
          </form>
          <Link href="/login" className="btn btn-link px-0 mt-2">
            Já tenho uma conta
          </Link>
        </div>
      </div>
    </main>
  );
}
