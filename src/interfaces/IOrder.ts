import ICustomer from "./ICustomer";
import IProduct from "./IProduct";

enum EStatus {
  "Pendente",
  "Preparando",
  "A caminho",
  "Entregue"
}

export default interface IOrder {
  readonly id?: string;
  cliente: ICustomer;
  produtos: IProduct[];
  subTotal: number;
  valorTotal: number;
  status: EStatus;
  enderecoEntrega?: Pick<ICustomer, "CEP">;
  formaPagamento: string;
  custoEntrega?: number;
  disconto?: number;
  formaEntrega?: string;
  dataPedido: Date;
  dataEntrega?: Date;
}
