"use client";
import ICustomer from "@/interfaces/ICustomer";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type UserState = Pick<ICustomer, "_id" | "nomeUsuario">;

type UserStore = UserState & {
  setUserData: (data: UserState) => void;
};

/**
 * A Zustand store for managing user-related data.
 *
 * This store provides state and related actions for managing user-specific
 * information such as the user's ID and username. It persists its data
 * using the `persist` middleware to ensure state is saved and rehydrated
 * from local storage under the key "user-storage".
 *
 * @typedef {Object} UserStore
 * @property {string} _id - Represents the unique identifier of the user.
 * @property {string} nomeUsuario - Stores the username.
 * @property {function(Object): void} setUserData - Action to set or update user data in the store.
 */
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
