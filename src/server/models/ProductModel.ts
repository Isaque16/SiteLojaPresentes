import { v4 as uuid } from "uuid";

export default class Product {
  private _id: string;
  private _name: string;
  private _category: string;
  private _price: number = 0;
  private _quantity: number = 0;
  private _description: string;
  private _imagePath: string;

  constructor(
    name: string,
    category: string,
    price: number,
    quantity: number,
    description: string,
    imagePath: string,
  ) {
    this._id = uuid();
    this._name = name;
    this._category = category;
    this._price = price;
    this._quantity = quantity;
    this._description = description;
    this._imagePath = imagePath;
  }

  // Product Getters and Setters
  get id(): string {
    return this._id;
  }

  get name(): string {
    return this._name;
  }
  set name(value: string) {
    this._name = value.trim(); // Removes extra spaces
  }

  get description(): string {
    return this._description;
  }
  set description(value: string) {
    this._description = value.trim(); // Removes extra spaces
  }

  get category(): string {
    return this._category;
  }
  set category(value: string) {
    this._category = value.trim(); // Removes extra spaces
  }

  get price(): number {
    return this._price;
  }
  set price(value: number) {
    if (value <= 0)
      throw new Error("The product price must be greater than zero.");
    this._price = value;
  }

  get quantity(): number {
    return this._quantity;
  }
  set quantity(value: number) {
    this._quantity = value < 0 ? 0 : value; // Prevents negative quantity
  }

  get imagePath(): string {
    return this._imagePath;
  }
  set imagePath(value: string) {
    this._imagePath = value;
  }
}
