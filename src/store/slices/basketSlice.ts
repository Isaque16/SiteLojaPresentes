"use client";
import IProduct from "@/interfaces/IProduct";
import { createSlice } from "@reduxjs/toolkit";

type BasketDataType = {
  items: IProduct[];
  quantities: number[];
  totalValue: number;
};

const initialState: BasketDataType = {
  items: [],
  quantities: [],
  totalValue: 0
};

const basketSlice = createSlice({
  name: "basket",
  initialState,
  reducers: {
    addToBasket: (state, { payload }) => {
      const { product, quantity }: { product: IProduct; quantity: number } =
        payload;
      const existingIndex = state.items.findIndex(
        (item) => item._id === product._id
      );

      if (existingIndex >= 0) state.quantities[existingIndex] += quantity;
      else {
        state.items.push(product);
        state.quantities.push(quantity);
      }

      state.totalValue = state.items.reduce(
        (total, item, i) => total + item.preco * state.quantities[i],
        0
      );
    },
    updateQuantity: (state, { payload }) => {
      const { index, quantity }: { index: number; quantity: number } = payload;

      if (index < state.items.length) {
        state.quantities[index] = quantity;

        state.totalValue = state.items.reduce(
          (total, item, i) => total + item.preco * state.quantities[i],
          0
        );
      }
    },
    removeFromBasket: (state, { payload }) => {
      const productId: string = payload;
      const index = state.items.findIndex((item) => item._id === productId);

      if (index >= 0) {
        state.totalValue -= state.items[index].preco * state.quantities[index];

        state.items.splice(index, 1);
        state.quantities.splice(index, 1);
      }
    },
    clearBasket: (state) => {
      state.items = [];
      state.quantities = [];
      state.totalValue = 0;
    }
  }
});

export const { addToBasket, updateQuantity, removeFromBasket, clearBasket } =
  basketSlice.actions;
export default basketSlice.reducer;
