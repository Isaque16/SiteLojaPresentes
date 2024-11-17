import EFormaPagamento from "./EFormaPagamento";
import EStatus from "./EStatus";
import IAddress from "./IAdress";
import ICustomer from "./ICustomer";
import IProduct from "./IProduct";

export default interface IOrder {
  readonly _id?: string;
  cliente: Omit<ICustomer, "senha">;
  cesta: IProduct[];
  subTotal: number;
  valorFrete?: number;
  valorTotal: number;
  formaPagamento: EFormaPagamento;
  status: EStatus;
  desconto?: number;
  metodoEnvio?: string;
  enderecoEntrega?: IAddress;
  dataEntrega?: Date;
  dataPedido: Date;
}
