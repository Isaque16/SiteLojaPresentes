import { router } from '../trpc';
import customerRouter from './customerRouter';
import orderRouter from './orderRouter';
import productRouter from './productRouter';
import authRouter from './authRouter';
import uploadRouter from './uploadRouter';

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/trpc/[trpc] will be automatically
 * available as queries and mutations.
 */
export const appRouter = router({
  products: productRouter,
  customers: customerRouter,
  orders: orderRouter,
  auth: authRouter,
  upload: uploadRouter
});

export type AppRouter = typeof appRouter;
