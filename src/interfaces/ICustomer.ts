// import IOrder from "./IOrder";

export default interface ICustomer {
  _id?: string;
  nome: string;
  senha: string;
  email: string;
  telefone: string;
  CEP: string;
  // historicoDeCompras: IOrder[];
}
