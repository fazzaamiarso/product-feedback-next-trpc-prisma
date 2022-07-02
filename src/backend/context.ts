import * as trpc from "@trpc/server";
import * as trpcNext from "@trpc/server/adapters/next";
import db from "@/db";
import { getSession } from "next-auth/react";

export const createContext = async ({ req, res }: trpcNext.CreateNextContextOptions) => {
  const session = await getSession({ req });
  return {
    prisma: db,
    req,
    res,
    session
  };
};
export type TrpcContext = trpc.inferAsyncReturnType<typeof createContext>;
