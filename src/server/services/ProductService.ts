import Product from "../models/ProductModel";

export default class ProductService {
  private products: Product[] = []; // <- Data base of the products

  // Read methods

  // Lists all products from the data base
  listProducts(): Product[] {
    return this.products;
  }

  // Filters products by category
  findProductsByCategory(category: string): Product[] {
    return this.products.filter((product) => product.category === category);
  }

  // Finds a product by ID
  findProductById(id: string): Product | undefined {
    return this.products.find((product) => product.id === id);
  }

  // Checks if a product is in stock
  checkStock(id: string): boolean {
    const product = this.findProductById(id);
    return product ? product.quantity > 0 : false;
  }

  // Insert methods

  // Adds a product to the catalog
  addProduct(product: Product): void {
    this.products.push(product);
  }

  // Update methods

  // Updates an existing product by ID
  updateProduct(id: string, updatedProduct: Partial<Product>): void {
    const product = this.products.find((prod) => prod.id === id);
    if (product) {
      Object.assign(product, updatedProduct);
      return;
    }
    throw new Error("Product not found.");
  }

  // Delete methods

  // Removes a product by ID
  removeProduct(id: string): void {
    this.products = this.products.filter((product) => product.id !== id);
  }
}
