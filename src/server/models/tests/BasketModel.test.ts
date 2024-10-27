import Basket from "../BasketModel";
import Product from "../ProductModel";

// Cria uma lista de produtos de exemplo
const mockProducts = [
    new Product( "Product 1", "Category A", 10.0, 2, "Description 1", "path/to/image1.jpg"),
    new Product("Product 2", "Category B", 20.0, 3, "Description 2", "path/to/image2.jpg"),
];

describe('Basket Model', () => {
    let basket: Basket;

    beforeEach(() => {
        basket = new Basket();
    });

    test('should initially have an empty product list and total value of 0', () => {
        expect(basket.products).toEqual([]);
        expect(basket.totalValue).toBe(0);
    });

    test('should add products and correctly update the products list', () => {
        basket.products = mockProducts;
        expect(basket.products).toHaveLength(2);
        expect(basket.products).toEqual(mockProducts);
    });

    test('should correctly update total value', () => {
        const newTotalValue = 100.0;
        basket.totalValue = newTotalValue;
        expect(basket.totalValue).toBe(newTotalValue);
    });

    test('should allow resetting products list and total value', () => {
        basket.products = mockProducts;
        basket.totalValue = 50.0;

        // Reseta para valores iniciais
        basket.products = [];
        basket.totalValue = 0;

        expect(basket.products).toEqual([]);
        expect(basket.totalValue).toBe(0);
    });
});
