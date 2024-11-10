import ICustomer from "./ICustomer";
import IProduct from "./IProduct";

type StatusType = "pendente" | "preparando" | "a caminho" | "entregue";

export default interface IOrder {
  id?: string;
  cliente: ICustomer;
  produtos: IProduct[];
  valorTotal: number;
  status: StatusType;
  enderecoEntrega: string;
  formaPagamento: string;
  custoEntrega: number;
  disconto?: number;
  formaEntrega: string;
  dataPedido: Date;
  dataEntrega?: Date;
}
