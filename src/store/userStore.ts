"use client";
import ICustomer from "@/interfaces/ICustomer";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type UserState = Pick<ICustomer, "_id" | "nomeUsuario">;

type UserStore = UserState & {
  setUserData: (data: UserState) => void;
};

const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      _id: "",
      nomeUsuario: "",

      setUserData: (data) => set(data)
    }),
    { name: "user-storage" }
  )
);

export default useUserStore;
