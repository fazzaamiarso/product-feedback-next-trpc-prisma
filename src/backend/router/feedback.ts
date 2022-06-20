import { createProtectedRouter } from "./../create-protected-router";
import { z } from "zod";
import { Category, Prisma, Status } from "@prisma/client";
const sortItems = z.enum(["Most Upvotes", "Least Upvotes", "Most Comments", "Least Comments"]);
const filterCategories = z.nativeEnum(Category).or(z.literal("ALL"));
const roadmapStatus = ["IN_PROGRESS", "LIVE", "PLANNED"] as const;

const baseFeedback = Prisma.validator<Prisma.FeedbackSelect>()({
  id: true,
  title: true,
  description: true,
  category: true,
  status: true,
  upvotes: true
});
const feedbackWithCounts = Prisma.validator<Prisma.FeedbackFindManyArgs>()({
  select: {
    ...baseFeedback,
    _count: { select: { upvotes: true } },
    comments: {
      include: { _count: { select: { replies: true } } }
    }
  }
});
type FeedbackWithCounts = Prisma.FeedbackGetPayload<typeof feedbackWithCounts>;

const countFeedbackInteractions = (comments: FeedbackWithCounts["comments"]) => {
  return comments.reduce((total, curr) => total + curr._count.replies + 1, 0);
};

export const feedbackRouter = createProtectedRouter
  .query("all", {
    input: z.object({ sort: sortItems, filter: filterCategories }),

    async resolve({ input, ctx }) {
      const feedbacks = await ctx.prisma.feedback.findMany({
        ...feedbackWithCounts,
        where: { category: input.filter === "ALL" ? undefined : input.filter, status: "SUGGESTION" }
      });

      if (feedbacks.length === 0) return { feedbacks: [] };

      const realFeedbacks = feedbacks.map((fb) => {
        const interactionsCount = countFeedbackInteractions(fb.comments);
        return {
          category: fb.category,
          status: fb.status,
          description: fb.description,
          id: fb.id,
          title: fb.title,
          upvotes: fb.upvotes,
          upvotesCount: fb._count.upvotes,
          interactionsCount
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
        feedbacks: realFeedbacks
      };
    }
  })
  .query("roadmapCount", {
    async resolve({ ctx }) {
      const roadmapsFeedback = await ctx.prisma.feedback.groupBy({
        by: ["status"],
        where: { status: { in: ["IN_PROGRESS", "LIVE", "PLANNED"] } },
        _count: true
      });

      const roadmapItems = roadmapsFeedback.reduce((acc, curr) => {
        return { ...acc, [curr.status]: curr._count };
      }, {} as Record<Exclude<Status, "SUGGESTION">, number>);
      return { roadmapItems };
    }
  })
  .query("roadmap", {
    input: z.enum(roadmapStatus),
    async resolve({ input, ctx }) {
      const feedbacks = await ctx.prisma.feedback.findMany({
        ...feedbackWithCounts,
        where: { status: { equals: input } }
      });
      if (feedbacks.length === 0) return { roadmaps: [] };
      const realFeedbacks = feedbacks.map((fb) => {
        const interactionsCount = countFeedbackInteractions(fb.comments);
        return {
          status: fb.status,
          category: fb.category,
          description: fb.description,
          id: fb.id,
          title: fb.title,
          upvotes: fb.upvotes,
          upvotesCount: fb._count.upvotes,
          interactionsCount
        };
      });
      return { roadmaps: realFeedbacks };
    }
  })
  .query("id", {
    input: z.object({ id: z.string() }),
    async resolve({ input, ctx }) {
      const feedbackInteractions = await ctx.prisma.feedback.findUnique({
        where: input,
        select: {
          comments: {
            include: { replies: { include: { repliedTo: true, replyFrom: true } }, user: true }
          }
        }
      });
      const fb = await ctx.prisma.feedback.findUnique({
        ...feedbackWithCounts,
        where: { id: input.id }
      });
      if (!fb) return {};
      const interactionsCount = countFeedbackInteractions(fb.comments);
      const feedback = {
        status: fb.status,
        category: fb.category,
        description: fb.description,
        id: fb.id,
        title: fb.title,
        upvotes: fb.upvotes,
        upvotesCount: fb._count.upvotes,
        interactionsCount
      };
      if (!feedback || !feedbackInteractions)
        throw Error("Couldn't find what you are looking for!");
      return { feedback, interactions: feedbackInteractions };
    }
  })
  .mutation("new", {
    input: z.object({
      title: z.string(),
      category: z.nativeEnum(Category),
      description: z.string()
    }),
    async resolve({ input, ctx }) {
      const userId = ctx.session.user.id;
      const createdFeedback = await ctx.prisma.feedback.create({
        data: { ...input, userId }
      });
      return createdFeedback;
    }
  })
  .mutation("edit", {
    input: z.object({
      feedbackId: z.string(),
      title: z.string(),
      category: z.nativeEnum(Category),
      status: z.nativeEnum(Status),
      description: z.string()
    }),
    async resolve({ input, ctx }) {
      const updatedFeedback = await ctx.prisma.feedback.update({
        data: {
          title: input.title,
          category: input.category,
          status: input.status,
          description: input.description
        },
        where: { id: input.feedbackId }
      });
      return updatedFeedback;
    }
  })
  .mutation("delete", {
    input: z.object({
      feedbackId: z.string()
    }),
    async resolve({ input, ctx }) {
      return await ctx.prisma.feedback.delete({ where: { id: input.feedbackId } });
    }
  })
  .mutation("upvote", {
    input: z.object({ feedbackId: z.string() }),
    async resolve({ input, ctx }) {
      const userId = ctx.session.user.id;
      const data = { feedbackId: input.feedbackId, userId };
      const existingUpvote = await ctx.prisma.upvote.findUnique({
        where: { userId_feedbackId: data }
      });
      if (existingUpvote)
        return await ctx.prisma.upvote.delete({
          where: { userId_feedbackId: data }
        });
      return await ctx.prisma.upvote.create({ data });
    }
  });
