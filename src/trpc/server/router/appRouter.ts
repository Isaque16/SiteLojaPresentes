import { router } from "../trpc";
import { customerRouter } from "./customerRouter";
import { orderRouter } from "./orderRouter";
import { productRouter } from "./productRouter";

export const appRouter = router({
  products: productRouter,
  customers: customerRouter,
  orders: orderRouter
});

export type AppRouter = typeof appRouter;
