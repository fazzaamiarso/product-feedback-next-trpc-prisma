import * as trpc from "@trpc/server";
import * as trpcNext from "@trpc/server/adapters/next";
import db from "@/db";

export const createContext = ({ req, res }: trpcNext.CreateNextContextOptions) => {
  return {
    prisma: db,
    req,
    res
  };
};
export type TrpcContext = trpc.inferAsyncReturnType<typeof createContext>;
