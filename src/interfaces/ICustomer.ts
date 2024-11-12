// import IOrder from "./IOrder";

export default interface ICustomer {
  _id?: string;
  nomeCompleto: string;
  nomeUsuario: string;
  senha: string;
  email: string;
  telefone: string;
  CEP?: string;
  // historicoDeCompras: IOrder[];
}
