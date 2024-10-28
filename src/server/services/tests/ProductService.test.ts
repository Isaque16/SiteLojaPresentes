import ProductService from "../ProductService";
import Product from "../../models/ProductModel";

describe("ProductService", () => {
  let productService: ProductService;
  let product1: Product;
  let product2: Product;

  beforeEach(() => {
    productService = new ProductService();
    product1 = new Product(
      "Product A",
      "Category 1",
      100,
      10,
      "Description A",
      "path/to/imageA",
    );
    product2 = new Product(
      "Product B",
      "Category 2",
      200,
      0,
      "Description B",
      "path/to/imageB",
    );
    productService.addProduct(product1);
    productService.addProduct(product2);
  });

  test("should list all products", () => {
    const products = productService.listProducts();
    expect(products).toHaveLength(2);
    expect(products).toContain(product1);
    expect(products).toContain(product2);
  });

  test("should find products by category", () => {
    const categoryProducts =
      productService.findProductsByCategory("Category 1");
    expect(categoryProducts).toHaveLength(1);
    expect(categoryProducts[0].name).toBe("Product A");
  });

  test("should find product by ID", () => {
    const foundProduct = productService.findProductById(product1.id);
    expect(foundProduct).toBeDefined();
    expect(foundProduct?.name).toBe("Product A");
  });

  test("should return undefined if product is not found by ID", () => {
    const nonExistentProduct = productService.findProductById("nonexistent-id");
    expect(nonExistentProduct).toBeUndefined();
  });

  test("should check if a product is in stock", () => {
    const isProduct1InStock = productService.checkStock(product1.id);
    const isProduct2InStock = productService.checkStock(product2.id);
    expect(isProduct1InStock).toBe(true);
    expect(isProduct2InStock).toBe(false);
  });

  test("should add a product to the catalog", () => {
    const newProduct = new Product(
      "Product C",
      "Category 3",
      150,
      5,
      "Description C",
      "path/to/imageC",
    );
    productService.addProduct(newProduct);
    const products = productService.listProducts();
    expect(products).toContain(newProduct);
  });

  test("should update an existing product", () => {
    productService.updateProduct(product1.id, { price: 120, quantity: 15 });
    const updatedProduct = productService.findProductById(product1.id);
    expect(updatedProduct?.price).toBe(120);
    expect(updatedProduct?.quantity).toBe(15);
  });

  test("should throw an error if updating a non-existent product", () => {
    expect(() =>
      productService.updateProduct("nonexistent-id", { price: 150 }),
    ).toThrow("Product not found.");
  });

  test("should remove a product by ID", () => {
    productService.removeProduct(product1.id);
    const products = productService.listProducts();
    expect(products).not.toContain(product1);
    expect(products).toHaveLength(1);
  });
});
