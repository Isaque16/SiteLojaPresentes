import Product from "../ProductModel";

describe("Product Model", () => {
  let product: Product;

  beforeEach(() => {
    product = new Product(
      "Test Product",
      "Electronics",
      100.0,
      5,
      "A sample product for testing purposes",
      "path/to/image.jpg",
    );
  });

  test("should initialize product with correct properties", () => {
    expect(product.id).toBeDefined();
    expect(product.name).toBe("Test Product");
    expect(product.category).toBe("Electronics");
    expect(product.price).toBe(100.0);
    expect(product.quantity).toBe(5);
    expect(product.description).toBe("A sample product for testing purposes");
    expect(product.imagePath).toBe("path/to/image.jpg");
  });

  test("should trim name, category, and description when set", () => {
    product.name = "  New Name  ";
    expect(product.name).toBe("New Name");

    product.category = "  New Category  ";
    expect(product.category).toBe("New Category");

    product.description = "  New Description  ";
    expect(product.description).toBe("New Description");
  });

  test("should throw an error if price is set to zero or negative", () => {
    expect(() => {
      product.price = 0;
    }).toThrow("The product price must be greater than zero.");

    expect(() => {
      product.price = -10;
    }).toThrow("The product price must be greater than zero.");
  });

  test("should set quantity to 0 if a negative value is provided", () => {
    product.quantity = -5;
    expect(product.quantity).toBe(0);
  });

  test("should allow setting a valid price", () => {
    product.price = 150;
    expect(product.price).toBe(150);
  });

  test("should update imagePath correctly", () => {
    const newPath = "path/to/new_image.jpg";
    product.imagePath = newPath;
    expect(product.imagePath).toBe(newPath);
  });
});
