import IOrder from '@/interfaces/IOrder';
import { create } from 'zustand';
import EStatus from '@/interfaces/EStatus';
import EPaymentMethod from '@/interfaces/EPaymentMethod';

type OrderStore = IOrder & {
  setOrder: (order: IOrder) => void;
};

/**
 * `useOrderStore` is a state management hook for handling order-related data
 * within the application. It leverages a state management library to provide
 * reactive state updates and encapsulates order-related operations.
 *
 * Properties:
 * - `cliente`: Object containing customer information such as `nomeCompleto`,
 *   `nomeUsuario`, `email`, `telefone`, and `CEP`.
 * - `cesta`: Array representing the collection of items in the shopping basket.
 * - `quantidades`: Array representing quantities corresponding to the items in the basket.
 * - `subTotal`: Number representing the subtotal price of the items in the basket.
 * - `valorTotal`: Number representing the total amount considering all charges.
 * - `status`: Represents the current status of the order, defaulting to `EStatus.PENDENTE`.
 * - `formaPagamento`: Enum indicating the payment method, defaulting to `EPaymentMethod.pix`.
 * - `dataPedido`: Date instance indicating when the order was placed.
 *
 * Methods:
 * - `setOrder(order)`: Updates the state with the provided `order` object,
 *    replacing the existing state with new values.
 */
const useOrderStore = create<OrderStore>((set) => ({
  cliente: {
    nomeCompleto: '',
    nomeUsuario: '',
    email: '',
    telefone: '',
    CEP: ''
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
