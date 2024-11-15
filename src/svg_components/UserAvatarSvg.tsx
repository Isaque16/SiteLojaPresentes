"use client";
import { RootState } from "@/store/store";
import { useSelector } from "react-redux";

export default function UserAvatarSvg() {
  const userData = useSelector((state: RootState) => state.user.nomeUsuario);
  const nomeUsuario = userData || "Convidado";

  return (
    <div className="flex-none">
      <div className="dropdown dropdown-end">
        <div role="button" tabIndex={0} className="avatar placeholder">
          <div className="bg-neutral text-neutral-content w-12 rounded-full">
            <span>C</span>
          </div>
        </div>
        <div
          tabIndex={0}
          className="card card-compact dropdown-content bg-base-100 z-[1] mt-3 w-52 shadow"
        >
          <div className="card-body">
            <span className="text-sm">Usuário: {nomeUsuario}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
