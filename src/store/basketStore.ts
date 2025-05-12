"use client";
import IProduct from "@/interfaces/IProduct";
import { create } from "zustand";
import { persist } from "zustand/middleware";

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
    { name: "basket-storage" }
  )
);

export default useBasketStore;
