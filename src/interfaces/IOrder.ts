import ICustomer from "./ICustomer";
import IProduct from "./IProduct";

export enum EStatus {
  "PENDENTE",
  "PREPRANDO",
  "A_CAMINHO",
  "ENTREGUE"
}

export interface IAddress {
  CEP: string;
  estado: string;
  bairro: string;
  rua: string;
  numero: string;
  complemento?: string;
}

export enum EFormaPagamento {
  "pix" = "PIX",
  "dinheiro" = "DINHEIRO",
  "credito" = "CARTAO_CREDITO",
  "debito" = "CARTAO_DEBITO",
  "boleto" = "BOLETO_BANCARIO"
}

export default interface IOrder {
  readonly id?: string;
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
