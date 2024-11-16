import IOrder, { EFormaPagamento, EStatus } from "@/interfaces/IOrder";
import { createSlice } from "@reduxjs/toolkit";

const initialState: IOrder = {
  cliente: {
    nomeCompleto: "",
    nomeUsuario: "",
    email: "",
    telefone: "",
    CEP: ""
  },
  cesta: [],
  subTotal: 0,
  valorTotal: 0,
  status: EStatus.PENDENTE,
  formaPagamento: EFormaPagamento.PIX,
  dataPedido: new Date()
};

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    setOrder: (state, action) => {
      const { order }: { order: IOrder } = action.payload;
      state.cliente = order.cliente;
      state.cesta = order.cesta;
      state.subTotal = order.subTotal;
      state.valorTotal = order.valorTotal;
      state.status = order.status;
      state.formaPagamento = order.formaPagamento;
      state.dataPedido = order.dataPedido;
    }
  }
});

export default orderSlice.reducer;
export const { setOrder } = orderSlice.actions;
