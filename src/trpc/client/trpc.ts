import { createTRPCReact } from '@trpc/react-query';
import { type AppRouter } from '@/trpc/server/router/appRouter';

export default createTRPCReact<AppRouter>();
