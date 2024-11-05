import ICustomer from "./ICustomer";
import IProduct from "./IProduct";

export default interface IOrder {
  id: string;
  customer: ICustomer;
  products: IProduct[];
  totalValue: number;
  status: string; // Valor padrão inicial
  orderDate: Date;
  deliveryDate?: Date;
  deliveryAddress: string;
  paymentMethod: string;
  shippingCost: number;
  discount: number;
  shippingMethod: string;
  notes?: string;
}
