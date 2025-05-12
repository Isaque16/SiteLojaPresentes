import IOrder from "@/interfaces/IOrder";
import { create } from "zustand";
import EStatus from "@/interfaces/EStatus";
import EPaymentMethod from "@/interfaces/EPaymentMethod";

type OrderStore = IOrder & {
  setOrder: (order: IOrder) => void;
};

const useOrderStore = create<OrderStore>((set) => ({
  cliente: {
    nomeCompleto: "",
    nomeUsuario: "",
    email: "",
    telefone: "",
    CEP: ""
  },
  cesta: [],
  quantidades: [],
  subTotal: 0,
  valorTotal: 0,
  status: EStatus.PENDENTE,
  formaPagamento: EPaymentMethod.pix,
  dataPedido: new Date(),

  setOrder: (order) => set({ ...order })
}));

export default useOrderStore;
