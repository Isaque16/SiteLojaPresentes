"use client";
import ICustomer from "@/interfaces/ICustomer";
import { createSlice } from "@reduxjs/toolkit";

const initialState: Pick<ICustomer, "_id" | "nomeUsuario"> = {
  _id: "",
  nomeUsuario: ""
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserData: (state, { payload }) => {
      const { _id, nomeUsuario }: typeof initialState = payload;
      state._id = _id;
      state.nomeUsuario = nomeUsuario;
    }
  }
});

export default userSlice.reducer;
export const { setUserData } = userSlice.actions;
