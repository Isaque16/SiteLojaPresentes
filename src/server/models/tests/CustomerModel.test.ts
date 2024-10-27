import Customer from '../CustomerModel';
import Basket from '../BasketModel';

describe('Customer Model', () => {
  let customer: Customer;

  beforeEach(() => {
    customer = new Customer(
      "John Doe",
      "john.doe@example.com",
      "+123456789",
      "123 Street, City, Country"
    );
  });

  test('should initialize Customer with correct properties', () => {
    expect(customer.id).toBeDefined();
    expect(customer.name).toBe("John Doe");
    expect(customer.email).toBe("john.doe@example.com");
    expect(customer.phone).toBe("+123456789");
    expect(customer.address).toBe("123 Street, City, Country");
    expect(customer.currentBasket).toBeInstanceOf(Basket);
    expect(customer.purchaseHistory).toEqual([]);
  });

  test('should trim spaces in name, email, phone, and address when set', () => {
    customer.name = "   Jane Doe   ";
    expect(customer.name).toBe("Jane Doe");

    customer.email = "   jane.doe@example.com   ";
    expect(customer.email).toBe("jane.doe@example.com");

    customer.phone = "   +987654321   ";
    expect(customer.phone).toBe("+987654321");

    customer.address = "   456 Avenue, New City   ";
    expect(customer.address).toBe("456 Avenue, New City");
  });

  test('should add basket to purchaseHistory and calculate totalSpent correctly', () => {
    const basket1 = new Basket();
    basket1.totalValue = 100;
    customer.purchaseHistory.push(basket1);

    const basket2 = new Basket();
    basket2.totalValue = 150;
    customer.purchaseHistory.push(basket2);

    expect(customer.purchaseHistory.length).toBe(2);
    expect(customer.totalSpent).toBe(250); // 100 + 150
  });

  test('should initialize with an empty purchaseHistory', () => {
    expect(customer.purchaseHistory).toEqual([]);
    expect(customer.totalSpent).toBe(0);
  });

  test('should allow setting a new currentBasket', () => {
    const newBasket = new Basket();
    customer.currentBasket = newBasket;
    expect(customer.currentBasket).toBe(newBasket);
  });
});
