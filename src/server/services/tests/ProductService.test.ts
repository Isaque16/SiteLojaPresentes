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
    productService.save(product1);
    productService.save(product2);
  });

  test("should list all products", () => {
    const products = productService.listAll();
    expect(products).toHaveLength(2);
    expect(products).toContain(product1);
    expect(products).toContain(product2);
  });

  test("should find products by category", () => {
    const categoryProducts =
      productService.findByCategory("Category 1");
    expect(categoryProducts).toHaveLength(1);
    expect(categoryProducts[0].name).toBe("Product A");
  });

  test("should find product by ID", () => {
    const foundProduct = productService.findById(product1.id);
    expect(foundProduct).toBeDefined();
    expect(foundProduct?.name).toBe("Product A");
  });

  test("should return undefined if product is not found by ID", () => {
    const nonExistentProduct = productService.findById("nonexistent-id");
    expect(nonExistentProduct).toBeUndefined();
  });

  test("should check if a product is in stock", () => {
    const isProduct1InStock = productService.checkStock(product1.id);
    const isProduct2InStock = productService.checkStock(product2.id);
    expect(isProduct1InStock).toBe(true);
    expect(isProduct2InStock).toBe(false);
  });

  test("should save a product to the catalog", () => {
    const newProduct = new Product(
      "Product C",
      "Category 3",
      150,
      5,
      "Description C",
      "path/to/imageC",
    );
    productService.save(newProduct);
    const products = productService.listAll();
    expect(products).toContain(newProduct);
  });

  test("should update an existing product", () => {
    productService.save({ price: 120, quantity: 15 }, product1.id);
    const updatedProduct = productService.findById(product1.id);
    expect(updatedProduct?.price).toBe(120);
    expect(updatedProduct?.quantity).toBe(15);
  });

  test("should remove a product by ID", () => {
    productService.remove(product1.id);
    const products = productService.listAll();
    expect(products).not.toContain(product1);
    expect(products).toHaveLength(1);
  });
});