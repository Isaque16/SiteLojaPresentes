import Product from "../models/ProductModel";

export default class ProductService {
  private products: Product[] = []; // <- Data base of the products

  // Read methods

  // Lists all products from the data base
  listAll(): Product[] {
    return this.products;
  }

  // Filters products by category
  findByCategory(category: string): Product[] {
    return this.products.filter((product) => product.category === category);
  }

  // Finds a product by ID
  findById(id: string): Product | undefined {
    return this.products.find((product) => product.id === id);
  }

  // Checks if a product is in stock
  checkStock(id: string): boolean {
    const product = this.findById(id);
    return product ? product.quantity > 0 : false;
  }

  // Updates an existing product by ID or creates a new one
  save(product: Partial<Product>, id?: string ): void {
    const findProduct = this.products.find((prod) => prod.id === id);
    if (findProduct) {
      Object.assign(findProduct, product);
      return;
    }
    this.products.push(product as Product);
  }

  // Delete methods

  // Removes a product by ID
  remove(id: string): void {
    this.products = this.products.filter((product) => product.id !== id);
  }
}
