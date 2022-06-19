import { TrpcContext } from "./context";
import * as trpc from "@trpc/server";

export const createProtectedRouter = trpc.router<TrpcContext>().middleware(({ ctx, next }) => {
  if (!ctx.session) throw new trpc.TRPCError({ code: "UNAUTHORIZED" });
  return next({
    ctx
  });
});
