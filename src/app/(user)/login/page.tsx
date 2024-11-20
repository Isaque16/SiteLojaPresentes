"use client";
import InputComponent from "@/components/InputComponent";
import { setUserData } from "@/store/slices/userSlice";
import { trpc } from "@/trpc/client/trpc";
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
    getValues,
    reset,
    setError,
    formState: { errors, isValid, isSubmitting }
  } = useForm<LoginType>({
    resolver: zodResolver(formDataSchema),
    mode: "onChange"
  });

  const { refetch } = trpc.customers.getByName.useQuery(
    getValues().nomeUsuario,
    { enabled: false }
  );

  async function loginUser({ nomeUsuario, senha }: LoginType) {
    try {
      const { data } = await refetch();

      const doesUserExist =
        data?.nomeUsuario === nomeUsuario && data?.senha === senha;

      if (!doesUserExist) {
        reset();
        setError("root", { message: "Usuário ou senha incorreto" });
        return;
      }

      dispatch(setUserData({ _id: data._id, nomeUsuario: data.nomeUsuario }));
      router.replace("/catalogo");
    } catch (error) {
      console.error("Erro ao logar o usuário:", error);
      setError("root", { message: "Erro ao logar usuário, tente novamente." });
    }
  }

  return (
    <main className="flex flex-col items-center justify-center h-screen">
      <div className="grid grid-cols-1 md:grid-cols-2 items-center justify-center shadow-md">
        <div className="flex flex-col items-center justify-center bg-base-200 h-full w-full rounded-tr-box rounded-tl-box md:rounded-tl-box md:rounded-bl-box md:rounded-tr-none">
          <h1 className="text-3xl font-bold text-center pt-10 pb-2">Login</h1>
          <div className="border-2 border-white md:w-1/6 w-1/2 mb-5"></div>
        </div>
        <div className="bg-base-100 p-10 w-full h-full rounded-bl-box rounded-br-box md:rounded-br-box md:rounded-tr-box md:rounded-bl-none">
          <form
            className="form-control gap-5"
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
        </div>
      </div>
    </main>
  );
}
