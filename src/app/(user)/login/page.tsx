'use client';
import trpc from '@/trpc/client/trpc';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { InputComponent } from '@/components';
import { useToast } from '@/contexts';

const formDataSchema = z.object({
  nomeUsuario: z
    .string()
    .min(3, 'O nome de usuário precisa ter pelo menos 3 caracteres'),
  senha: z.string().min(6, 'A senha precisa ter pelo menos 6 caracteres')
});

type LoginType = { nomeUsuario: string; senha: string };

export default function Cadastro() {
  const router = useRouter();
  const { showToast } = useToast();

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { isValid, isSubmitting }
  } = useForm<LoginType>({
    resolver: zodResolver(formDataSchema),
    mode: 'onChange'
  });

  const { mutateAsync: loginMutation } = trpc.auth.login.useMutation({
    onSuccess: (data) => {
      if (data.success) {
        showToast('Bem vindo de volta!', 'success');
        router.replace('/catalogo');
      } else {
        reset();
        setError('root', { message: data.message || 'Falha na autenticação' });
        showToast(data.message || 'Falha na autenticação', 'error');
      }
    },
    onError: () => {
      showToast('Erro ao logar usuário, tente novamente.', 'error');
    }
  });

  async function loginUser(credentials: LoginType) {
    await loginMutation(credentials);
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
