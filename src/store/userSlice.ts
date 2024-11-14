import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  nomeUsuario: ""
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setNomeUsuario: (state, action) => {
      const { nomeUsuario } = action.payload;
      state.nomeUsuario = nomeUsuario;
    }
  }
});

export const { setNomeUsuario } = userSlice.actions;
export default userSlice.reducer;
