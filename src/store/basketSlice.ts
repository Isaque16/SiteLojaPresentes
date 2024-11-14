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
    addToBasket: (state, action) => {
      const { product, quantity }: { product: IProduct; quantity: number } =
        action.payload;
      const existingIndex = state.items.findIndex(
        (item) => item._id === product._id
      );

      if (existingIndex >= 0) state.quantities[existingIndex] += quantity;
      else {
        state.items.push(product);
        state.quantities.push(quantity);
      }

      state.totalValue += product.preco * quantity;
    },
    updateQuantity: (state, action) => {
      const { index, quantity }: { index: number; quantity: number } =
        action.payload;

      if (index < state.items.length) {
        // Corrige a verificação de limite
        state.quantities[index] = quantity;

        // Recalcula o valor total com as novas quantidades
        state.totalValue = state.items.reduce(
          (total, item, i) => total + item.preco * state.quantities[i],
          0
        );
      }
    },
    removeFromBasket: (state, action) => {
      const productId: string = action.payload; // Corrigido para `string`
      const index = state.items.findIndex((item) => item._id === productId);

      if (index >= 0) {
        state.totalValue -= state.items[index].preco * state.quantities[index];

        state.items.splice(index, 1);
        state.quantities.splice(index, 1);
      }
    }
  }
});

export const { addToBasket, updateQuantity, removeFromBasket } =
  basketSlice.actions;
export default basketSlice.reducer;
