import Product from "./ProductModel"

export default class Basket {
    
    private _products: Product[] = []
    private _totalValue: number = 0.00

    // Products Getter
    get products(): Product[] {
        return this._products
    }
    set products(products: Product[]) {
        this._products = products
    }

    // Getter for total value
    get totalValue(): number {
        return this._totalValue
    }
    set totalValue(totalValue: number) {
        this._totalValue = totalValue
    }

}
