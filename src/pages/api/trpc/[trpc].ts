import superjson from "superjson";
import * as trpc from "@trpc/server";
import * as trpcNext from "@trpc/server/adapters/next";
import { z } from "zod";
import db from "@/db";
import { Prisma } from "@prisma/client";

const transformedFeedbacks = Prisma.validator<Prisma.FeedbackArgs>()({
  select: {
    category: true,
    description: true,
    id: true,
    title: true,
  },
});
type TransformedFeedbacks = Prisma.FeedbackGetPayload<
  typeof transformedFeedbacks
> & { interactionsCount: number; upvotesCount: number };

export const appRouter = trpc
  .router()
  .transformer(superjson)
  .query("feedback", {
    input: z.string(),
    async resolve({ input }) {
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
      const realFeedbacks: TransformedFeedbacks[] = feedbacks.map((fb) => {
        const interactionsCount =
          fb.comments.reduce((total, curr) => total + curr._count.replies, 0) +
          fb._count.comments;
        return {
          category: fb.category,
          description: fb.description,
          id: fb.id,
          title: fb.title,
          upvotesCount: fb._count.upvotes,
          interactionsCount,
        };
      });
      let sortedFeedback = realFeedbacks;
      if (input === "Most Upvotes")
        sortedFeedback = realFeedbacks.sort(
          (a, b) => b.upvotesCount - a.upvotesCount
        );
      if (input === "Least Upvotes")
        sortedFeedback = realFeedbacks.sort(
          (a, b) => a.upvotesCount - b.upvotesCount
        );
      if (input === "Most Comments")
        sortedFeedback = realFeedbacks.sort(
          (a, b) => b.interactionsCount - a.interactionsCount
        );
      if (input === "Least Comments")
        sortedFeedback = realFeedbacks.sort(
          (a, b) => a.interactionsCount - b.interactionsCount
        );
      return {
        feedbacks: sortedFeedback,
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
