'use client';
import trpc from '@/trpc/client/trpc';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

function useIdCookie() {
  const [userId, setUserId] = useState<string | null>(null);
  const { data } = trpc.auth.checkSession.useQuery();

  useEffect(() => {
    const checkCookie = () => {
      setUserId((prev) =>
        prev !== data?.userId ? (data?.userId ?? null) : prev
      );
    };
    checkCookie();

    const interval = setInterval(checkCookie, 2000);
    window.addEventListener('focus', checkCookie);

    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', checkCookie);
    };
  }, [data?.userId]);

  return userId;
}

export default function UserAvatar() {
  const router = useRouter();
  const userId: string | null = useIdCookie();

  const { data, isLoading } = trpc.customers.getById.useQuery(
    userId as string,
    { enabled: !!userId }
  );

  const { mutateAsync: logoutMutation } = trpc.auth.logout.useMutation();

  const logOut = async () => {
    await logoutMutation();
    router.replace('/login');
  };

  const renderAvatar = () => {
    const initial = data?.nomeUsuario?.charAt(0) ?? 'C';
    return (
      <div className="w-12 py-3 flex justify-center bg-neutral text-neutral-content rounded-full">
        <span>{initial}</span>
      </div>
    );
  };

  return isLoading ? (
    <div className="flex-none">
      <div className="avatar placeholder">
        <div className="bg-neutral-300 w-12 rounded-full animate-pulse py-5">
          <span className="opacity-0">C</span>
        </div>
      </div>
    </div>
  ) : (
    <div className="flex-none">
      <div className="dropdown dropdown-end">
        <div
          role="button"
          tabIndex={0}
          className="avatar avatar-placeholder cursor-pointer"
          aria-haspopup="true"
        >
          {renderAvatar()}
        </div>
        <div
          tabIndex={0}
          className="card card-compact dropdown-content bg-base-100 z-10 mt-3 w-52 shadow-sm"
          aria-label="Menu do usuário"
        >
          <div className="card-body">
            <span className="text-lg font-medium">
              {data?.nomeUsuario || 'Convidado'}
            </span>
            <span className="text-lg font-medium flex items-center gap-2">
              Tema:
              <label className="swap swap-rotate">
                <input
                  type="checkbox"
                  className="theme-controller"
                  value="light"
                />
                <svg
                  className="swap-on w-5 h-5 fill-current"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                >
                  <path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" />
                </svg>
                <svg
                  className="swap-off w-5 h-5 fill-current"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                >
                  <path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" />
                </svg>
              </label>
            </span>
            {!data ? (
              <Link href="/login" className="btn btn-ghost text-xl">
                Entrar
              </Link>
            ) : (
              <ul className="space-y-1 mt-2">
                <li>
                  <Link
                    href="/config"
                    className="link-primary flex items-center gap-2 py-1 hover:underline"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    Configurações
                  </Link>
                </li>
                <li>
                  <Link
                    href="/historico"
                    className="link-primary flex items-center gap-2 py-1 hover:underline"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    Histórico de Compras
                  </Link>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={logOut}
                    className="link-primary flex items-center gap-2 w-full text-left py-1 hover:underline"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      />
                    </svg>
                    Log out
                  </button>
                </li>
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
