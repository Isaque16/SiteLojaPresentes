import IOrder from "./IOrder";

export default interface ICustomer {
  name: string;
  email: string;
  phone: string;
  address: string;
  historicoDeCompras: IOrder[];
}
