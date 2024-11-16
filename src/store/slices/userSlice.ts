"use client";
import ICustomer from "@/interfaces/ICustomer";
import { createSlice } from "@reduxjs/toolkit";

const initialState: Omit<ICustomer, "senha"> = {
  _id: "",
  nomeCompleto: "",
  nomeUsuario: "",
  email: "",
  telefone: ""
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserData: (state, { payload }) => {
      const {
        _id,
        nomeCompleto,
        nomeUsuario,
        email,
        telefone
      }: typeof initialState = payload;
      state._id = _id;
      state.nomeCompleto = nomeCompleto;
      state.nomeUsuario = nomeUsuario;
      state.email = email;
      state.telefone = telefone;
    }
  }
});

export default userSlice.reducer;
export const { setUserData } = userSlice.actions;
