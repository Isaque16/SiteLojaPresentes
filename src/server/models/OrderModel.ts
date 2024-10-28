import Product from "./ProductModel";
import Customer from "./CustomerModel"; // Supondo que você tenha um modelo para o cliente.
import { v4 as uuid } from "uuid";

export default class Order {
  private _id: string;
  private _customer: Customer;
  private _products: Product[] = [];
  private _totalValue: number = 0.0;
  private _status: string = "Processando"; // Valor padrão inicial
  private _orderDate: Date;
  private _deliveryDate?: Date;
  private _deliveryAddress: string;
  private _paymentMethod: string;
  private _shippingCost: number = 0.0;
  private _discount: number = 0.0;
  private _shippingMethod: string;
  private _notes?: string;

  constructor(
    customer: Customer,
    products: Product[],
    deliveryAddress: string,
    paymentMethod: string,
    shippingMethod: string,
  ) {
    this._id = uuid();
    this._products = products;
    this._customer = customer;
    this._deliveryAddress = deliveryAddress;
    this._paymentMethod = paymentMethod;
    this._shippingMethod = shippingMethod;
    this._orderDate = new Date();
    this.calculateTotalValue();
  }

  // Calcula o valor total com descontos e frete
  private calculateTotalValue() {
    const productsTotal = this._products.reduce(
      (acc, product) => acc + product.price,
      0,
    );
    this._totalValue = productsTotal + this._shippingCost - this._discount;
  }

  // Getters e Setters para cada propriedade

  get id(): string {
    return this._id;
  }

  get products(): Product[] {
    return this._products;
  }

  set products(products: Product[]) {
    this._products = products;
    this.calculateTotalValue();
  }

  get totalValue(): number {
    return this._totalValue;
  }

  get status(): string {
    return this._status;
  }

  set status(status: string) {
    this._status = status;
  }

  get orderDate(): Date {
    return this._orderDate;
  }

  get deliveryDate(): Date | undefined {
    return this._deliveryDate;
  }

  set deliveryDate(date: Date | undefined) {
    this._deliveryDate = date;
  }

  get customer(): Customer {
    return this._customer;
  }

  get deliveryAddress(): string {
    return this._deliveryAddress;
  }

  get paymentMethod(): string {
    return this._paymentMethod;
  }

  set paymentMethod(method: string) {
    this._paymentMethod = method;
  }

  get shippingCost(): number {
    return this._shippingCost;
  }

  set shippingCost(cost: number) {
    this._shippingCost = cost;
    this.calculateTotalValue();
  }

  get discount(): number {
    return this._discount;
  }

  set discount(discount: number) {
    this._discount = discount;
    this.calculateTotalValue();
  }

  get shippingMethod(): string {
    return this._shippingMethod;
  }

  set shippingMethod(method: string) {
    this._shippingMethod = method;
  }

  get notes(): string | undefined {
    return this._notes;
  }

  set notes(notes: string | undefined) {
    this._notes = notes;
  }
}
