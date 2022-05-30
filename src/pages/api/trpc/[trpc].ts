import superjson from "superjson";
import * as trpc from "@trpc/server";
import * as trpcNext from "@trpc/server/adapters/next";
import { z } from "zod";
import db from "../../../db/prisma";

export const appRouter = trpc
  .router()
  .transformer(superjson)
  .query("user", {
    async resolve() {
      const users = await db.user.findMany();
      return {
        users,
      };
    },
  });

// export type definition of API
export type AppRouter = typeof appRouter;

// export API handler
export default trpcNext.createNextApiHandler({
  router: appRouter,
  createContext: () => null,
});
