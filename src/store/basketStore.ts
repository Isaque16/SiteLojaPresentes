'use client';
import IProduct from '@/interfaces/IProduct';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type BasketDataType = {
  items: IProduct[];
  quantities: number[];
  totalValue: number;
};

type BasketStore = BasketDataType & {
  addToBasket: (product: IProduct, quantity: number) => void;
  updateQuantity: (index: number, quantity: number) => void;
  removeFromBasket: (productId: string) => void;
  clearBasket: () => void;
};

/**
 * A Zustand store for managing a basket in a shopping application.
 *
 * This store includes the state and many utility functions for managing shopping basket data,
 * such as items, quantities, and total value. The data is persisted using a storage mechanism.
 *
 * State:
 * - `items`: Represents the list of products in the basket.
 * - `quantities`: Contains the corresponding quantities for products in the basket.
 * - `totalValue`: The total monetary value of all items in the basket.
 *
 * Methods:
 * - `addToBasket(product, quantity)`: Adds a product to the basket or updates the quantity of an existing product.
 * - `updateQuantity(index, quantity)`: Updates the quantity of a product in the basket by its index.
 * - `removeFromBasket(productId)`: Removes a product from the basket by its unique identifier.
 * - `clearBasket()`: Clears the basket, resetting all state to initial values.
 */
const useBasketStore = create<BasketStore>()(
  persist(
    (set) => ({
      items: [],
      quantities: [],
      totalValue: 0,

      addToBasket: (product, quantity) =>
        set((state) => {
          const existingIndex = state.items.findIndex(
            (item) => item._id === product._id
          );

          const newQuantities = [...state.quantities];
          const newItems = [...state.items];

          if (existingIndex >= 0) {
            newQuantities[existingIndex] += quantity;
          } else {
            newItems.push(product);
            newQuantities.push(quantity);
          }

          const newTotalValue = newItems.reduce(
            (total, item, i) => total + item.preco * newQuantities[i],
            0
          );

          return {
            items: newItems,
            quantities: newQuantities,
            totalValue: newTotalValue
          };
        }),

      updateQuantity: (index, quantity) =>
        set((state) => {
          if (index >= state.items.length) return state;

          const newQuantities = [...state.quantities];
          newQuantities[index] = quantity;

          const newTotalValue = state.items.reduce(
            (total, item, i) => total + item.preco * newQuantities[i],
            0
          );

          return {
            quantities: newQuantities,
            totalValue: newTotalValue
          };
        }),

      removeFromBasket: (productId) =>
        set((state) => {
          const index = state.items.findIndex((item) => item._id === productId);

          if (index < 0) return state;

          const newItems = [...state.items];
          const newQuantities = [...state.quantities];

          const newTotalValue =
            state.totalValue -
            state.items[index].preco * state.quantities[index];

          newItems.splice(index, 1);
          newQuantities.splice(index, 1);

          return {
            items: newItems,
            quantities: newQuantities,
            totalValue: newTotalValue
          };
        }),

      clearBasket: () => set({ items: [], quantities: [], totalValue: 0 })
    }),
    { name: 'basket-storage' }
  )
);

export default useBasketStore;
