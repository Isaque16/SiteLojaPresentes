"use client";
import { RootState } from "@/store/store";
import { trpc } from "@/trpc/client/trpc";
import { useSelector } from "react-redux";

export default function UserAvatarSvg() {
  const userData = useSelector((state: RootState) => state.user);
  const { data } = trpc.customers.getById.useQuery(userData._id!);

  return (
    <div className="flex-none">
      <div className="dropdown dropdown-top dropdown-left md:dropdown-bottom md:dropdown-end">
        <div role="button" tabIndex={0} className="avatar placeholder">
          <div className="bg-neutral text-neutral-content w-12 rounded-full">
            <span>{data?.nomeUsuario.charAt(0) ?? "C"}</span>
          </div>
        </div>
        <div
          tabIndex={0}
          className="card card-compact dropdown-content bg-base-100 z-[1] mt-3 w-52 shadow"
        >
          <div className="card-body">
            <span className="text-sm">
              Usuário: {userData.nomeUsuario || "Convidado"}
            </span>
            <span className="text-sm">Email: {data?.email || "Sem email"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
