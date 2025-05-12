"use client";
import trpc from "@/trpc/client/trpc";
import { deleteCookie, getCookie } from "cookies-next/client";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function UserAvatar() {
  const router = useRouter();
  const userId = getCookie("id");

  const { data, isLoading } = trpc.customers.getById.useQuery(
    userId as string,
    { enabled: !!userId }
  );

  const logOut = () => {
    deleteCookie("id");
    router.replace("/login");
  };

  const renderAvatar = () => {
    const initial = data?.nomeUsuario?.charAt(0) ?? "C";
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
        <ul
          tabIndex={0}
          className="card card-compact dropdown-content bg-base-100 z-10 mt-3 w-52 shadow-sm"
          aria-label="Menu do usuário"
        >
          <li className="card-body">
            <span className="text-lg font-medium">
              {data?.nomeUsuario || "Convidado"}
            </span>
            <ul className="space-y-1 mt-2">
              <li>
                <Link
                  href="/config"
                  className="link-primary block py-1 hover:underline"
                >
                  Configurações
                </Link>
              </li>
              <li>
                <Link
                  href="/historico"
                  className="link-primary block py-1 hover:underline"
                >
                  Histórico de Compras
                </Link>
              </li>
              <li>
                <button
                  type="button"
                  onClick={logOut}
                  className="link-primary w-full text-left py-1 hover:underline"
                >
                  Log out
                </button>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  );
}
