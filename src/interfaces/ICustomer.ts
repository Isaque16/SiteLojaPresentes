import IAddress from "./IAdress";
import IOrder from "./IOrder";

export default interface ICustomer {
  readonly _id?: string;
  nomeCompleto: string;
  nomeUsuario: string;
  senha: string;
  email: string;
  telefone: string;
  endereco?: IAddress;
  historicoDeCompras?: IOrder[];
}
