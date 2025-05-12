import EPaymentMethod from "./EPaymentMethod";
import EStatus from "./EStatus";
import IAddress from "./IAddress";
import ICustomer from "./ICustomer";
import IProduct from "./IProduct";

export default interface IOrder {
  readonly _id?: string;
  cliente: Omit<ICustomer, "senha">;
  cesta: IProduct[];
  quantidades: number[];
  subTotal: number;
  valorFrete?: number;
  valorTotal: number;
  formaPagamento: EPaymentMethod;
  status: EStatus;
  desconto?: number;
  metodoEnvio?: string;
  enderecoEntrega?: IAddress;
  dataEntrega?: Date | string;
  dataPedido: Date | string;
}
