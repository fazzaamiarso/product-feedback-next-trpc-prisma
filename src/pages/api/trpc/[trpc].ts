import superjson from "superjson";
import * as trpc from "@trpc/server";
import * as trpcNext from "@trpc/server/adapters/next";
import { z } from "zod";
import db from "@/db";

export const appRouter = trpc
  .router()
  .transformer(superjson)
  .query("feedback", {
    async resolve() {
      const feedbacks = await db.feedback.findMany({
        select: {
          category: true,
          description: true,
          id: true,
          title: true,
          comments: {
            select: { _count: { select: { replies: true } } },
          },
          _count: { select: { upvotes: true, comments: true } },
        },
      });
      return {
        feedbacks,
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
