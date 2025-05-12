"use client";
import trpc from "@/trpc/client/trpc";
import { deleteCookie, getCookie } from "cookies-next/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function UserAvatar() {
  const router = useRouter();
  const userId = getCookie("id");
  const { data } = userId
    ? trpc.customers.getById.useQuery(userId as string)
    : { data: null };
  const [userData, setUserData] = useState(data);
  useEffect(() => {
    setUserData(data);
  }, [data]);

  const logOut = () => {
    deleteCookie("id");
    router.replace("/login");
  };

  return (
    <div className="flex-none">
      <div className="dropdown dropdown-end">
        <div role="button" tabIndex={0} className="avatar placeholder">
          <div className="bg-neutral text-neutral-content w-12 rounded-full py-5">
            <span>{userData?.nomeUsuario.charAt(0) ?? "C"}</span>
          </div>
        </div>
        <div
          tabIndex={0}
          className="card card-compact dropdown-content bg-base-100 z-1 mt-3 w-52 shadow-sm"
        >
          <div className="card-body">
            <span className="text-lg">
              {userData?.nomeUsuario || "Convidado"}
            </span>
            <ul className="list-item ring-base-100">
              <li>
                <Link
                  href="/config"
                  className="link-primary hover:cursor-pointer"
                >
                  Configurações
                </Link>
              </li>
              <li className="link-primary hover:cursor-pointer">
                <Link href="/historico">Histórico de Compras</Link>
              </li>
              <li className="link-primary hover:cursor-pointer">
                <button onClick={logOut}>Log out</button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
