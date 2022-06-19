import { TrpcContext } from "./context";
import * as trpc from "@trpc/server";

export const createProtectedRouter = trpc.router<TrpcContext>().middleware(({ ctx, next }) => {
  if (!ctx.session?.user) throw new trpc.TRPCError({ code: "UNAUTHORIZED" });
  return next({
    ctx: {
      ...ctx,
      session: ctx.session
    }
  });
});
