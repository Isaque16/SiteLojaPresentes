import  { v4 as uuid } from "uuid"
import Basket from "./BasketModel"

export default class User {
  
  private _id: string
  private _name: string
  private _email: string
  private _phone: string
  private _address: string
  private _purchaseHistory: Basket[] = []
  private _currentBasket: Basket

  constructor(
    name: string, 
    email: string, 
    phone: string, 
    address: string
  ) {
    this._id = uuid()
    this._name = name
    this._email = email
    this._phone = phone
    this._address = address
    this._currentBasket = new Basket() // Each client starts with a basket
  }

  // Getters and Setters
  get id(): string {
    return this._id
  }

  get name(): string {
    return this._name
  }
  set name(name: string) {
    this._name = name.trim()
  }

  get email(): string {
    return this._email
  }
  set email(email: string) {
    this._email = email.trim()
  }

  get phone(): string {
    return this._phone
  }
  set phone(phone: string) {
    this._phone = phone.trim()
  }

  get address(): string {
    return this._address
  }
  set address(address: string) {
    this._address = address.trim()
  }

  get currentBasket(): Basket {
    return this._currentBasket
  }
  set currentBasket(basket: Basket) {
    this._currentBasket = basket
  }

  // Returns the purchase history
  get purchaseHistory(): Basket[] {
    return this._purchaseHistory
  }

  // Returns the total spent on all purchases
  get totalSpent(): number {
    return this._purchaseHistory.reduce((total, basket) => total + basket.totalValue, 0)
  }
  
}
