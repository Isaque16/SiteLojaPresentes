import { createTRPCReact } from "@trpc/react-query";
import { AppRouter } from "../server/router/appRouter";

export const trpc = createTRPCReact<AppRouter>();