import superjson from "superjson";
import * as trpc from "@trpc/server";
import * as trpcNext from "@trpc/server/adapters/next";
import { z } from "zod";
import db from "@/db";
import { Category, Prisma, Status } from "@prisma/client";

const CategoryEnum = z.nativeEnum(Category).or(z.literal("ALL"));
export type EnumCategory = z.infer<typeof CategoryEnum>;

const RoadmapsEnum = ["IN_PROGRESS", "LIVE", "PLANNED"] as const;

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
    input: z.object({ sort: z.string(), filter: CategoryEnum }),
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
        where: { category: input.filter === "ALL" ? undefined : input.filter },
      });
      if (feedbacks.length === 0) return { feedbacks: [] };

      const realFeedbacks = feedbacks.map((fb) => {
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
      if (input.sort === "Most Upvotes")
        realFeedbacks.sort((a, b) => b.upvotesCount - a.upvotesCount);
      if (input.sort === "Least Upvotes")
        realFeedbacks.sort((a, b) => a.upvotesCount - b.upvotesCount);
      if (input.sort === "Most Comments")
        realFeedbacks.sort((a, b) => b.interactionsCount - a.interactionsCount);
      if (input.sort === "Least Comments")
        realFeedbacks.sort((a, b) => a.interactionsCount - b.interactionsCount);
      return {
        feedbacks: realFeedbacks,
      };
    },
  })
  .query("feedback.roadmap", {
    async resolve() {
      const roadmapItems = await db.feedback.groupBy({
        by: ["status"],
        where: { status: { in: ["IN_PROGRESS", "LIVE", "PLANNED"] } },
        _count: true,
      });
      type TRoadmap = typeof roadmapItems[number];
      const items = roadmapItems.reduce((acc, curr) => {
        return { ...acc, [curr.status]: curr._count };
      }, {} as Record<TRoadmap["status"], TRoadmap["_count"]>);
      //TODO: types still includes "SUGGESTIONS" which is not suppose to be there
      return { roadmapItems: items };
    },
  })
  .query("feedback.roadmapItem", {
    input: z.enum(RoadmapsEnum),
    async resolve({ input }) {
      const feedbacks = await db.feedback.findMany({
        select: {
          category: true,
          description: true,
          id: true,
          title: true,
          status: true,
          comments: {
            select: { _count: { select: { replies: true } } },
          },
          _count: { select: { upvotes: true, comments: true } },
        },
        where: { status: { equals: input } },
      });
      if (feedbacks.length === 0) return { roadmaps: [] };

      const realFeedbacks = feedbacks.map((fb) => {
        const interactionsCount =
          fb.comments.reduce((total, curr) => total + curr._count.replies, 0) +
          fb._count.comments;
        return {
          status: fb.status,
          category: fb.category,
          description: fb.description,
          id: fb.id,
          title: fb.title,
          upvotesCount: fb._count.upvotes,
          interactionsCount,
        };
      });
      return { roadmaps: realFeedbacks };
    },
  });

// export type definition of API
export type AppRouter = typeof appRouter;

// export API handler
export default trpcNext.createNextApiHandler({
  router: appRouter,
  createContext: () => null,
});
