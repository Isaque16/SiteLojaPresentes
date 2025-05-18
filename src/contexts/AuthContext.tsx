'use client';
import { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import trpc from '@/trpc/client/trpc';
import { useToast } from "@/contexts";
import { useRouter } from "next/navigation";
import { deleteCookie, getCookie, setCookie } from "cookies-next/client";

interface AuthContextType {
  user: { id: string } | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<{ id: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { showToast } = useToast();

  const { mutateAsync: loginMutation } = trpc.auth.login.useMutation({
    onSuccess: (data) => {
      if (data.success && 'token' in data && data.token) {
        setCookie('authToken', data.token);
        if ('userId' in data && data.userId) {
          setUser({ id: data.userId });
        }
        showToast('Bem vindo de volta!', 'success');
        router.replace('/catalogo');
      } else showToast(data.message || 'Falha na autenticação', 'error');
    },
    onError: () => showToast('Erro ao logar usuário, tente novamente.', 'error')
  });

  const token = getCookie('authToken') as string;
  const { data: currentUser } = trpc.auth.checkSession.useQuery(token, {
    enabled: !!token,
    retry: false
  });

  useEffect(() => {
    if (currentUser?.userId) {
      setUser({ id: currentUser.userId });
    } else if (!token) {
      setUser(null);
    }
    setIsLoading(false);
  }, [currentUser, token]);

  async function login(email: string, password: string) {
    await loginMutation({
      nomeUsuario: email,
      senha: password
    });
  }

  function logout() {
    deleteCookie('authToken');
    setUser(null);
    router.replace('/login');
  }

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      login,
      logout,
      isAuthenticated: Boolean(user)
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};
