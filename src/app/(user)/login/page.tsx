'use client';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { object, pipe, string, minLength } from 'valibot';
import { InputComponent } from '@/components';
import { useAuth } from "@/contexts";
import { valibotResolver } from "@hookform/resolvers/valibot";

const formDataSchema = object({
  nomeUsuario: pipe(string(), minLength(3, 'O nome de usuário precisa ter pelo menos 3 caracteres')),
  senha: pipe(string(), minLength(6, 'A senha precisa ter pelo menos 6 caracteres'))
});

type LoginType = { nomeUsuario: string; senha: string };

export default function Cadastro() {
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { isValid, isSubmitting }
  } = useForm<LoginType>({
    resolver: valibotResolver(formDataSchema),
    mode: 'onChange'
  });

  async function loginUser({ nomeUsuario, senha }: LoginType) {
    await login(nomeUsuario, senha);
  }

  const fields = [
    { name: 'nomeUsuario', label: 'Usuario', type: 'text' },
    { name: 'senha', label: 'Senha', type: 'password' }
  ];

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
            {fields.map(({ name, label, type }) => (
              <div key={name} className="mb-4">
                <InputComponent
                  label={label}
                  name={name}
                  type={type}
                  placeholder={`Digite seu ${label}`}
                  register={register}
                />
              </div>
            ))}
            <button
              type="submit"
              className={`text-xl btn ${
                !isValid || isSubmitting ? 'btn-disabled' : ''
              }`}
              disabled={!isValid || isSubmitting}
            >
              {isSubmitting ? (
                <div className="loading loading-dots loading-lg"></div>
              ) : (
                'Entrar'
              )}
            </button>
          </form>
          <Link href="/cadastro" className="btn btn-link px-0 mt-2">
            Não tenho uma conta
          </Link>
        </div>
      </div>
    </main>
  );
}
