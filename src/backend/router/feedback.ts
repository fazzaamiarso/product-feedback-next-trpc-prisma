import { createRouter } from "./../create-router";
import { z } from "zod";
import db from "@/db";
import { Category, Prisma, Status } from "@prisma/client";
const sortItems = z.enum(["Most Upvotes", "Least Upvotes", "Most Comments", "Least Comments"]);
const filterCategories = z.nativeEnum(Category).or(z.literal("ALL"));
const roadmapStatus = ["IN_PROGRESS", "LIVE", "PLANNED"] as const;

const baseFeedback = Prisma.validator<Prisma.FeedbackSelect>()({
  id: true,
  title: true,
  description: true,
  category: true,
  status: true
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

export const feedbackRouter = createRouter
  .query("all", {
    input: z.object({ sort: sortItems, filter: filterCategories }),

    async resolve({ input }) {
      const feedbacks = await db.feedback.findMany({
        ...feedbackWithCounts,
        where: { category: input.filter === "ALL" ? undefined : input.filter }
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
    async resolve() {
      const roadmapsFeedback = await db.feedback.groupBy({
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
    async resolve({ input }) {
      const feedbacks = await db.feedback.findMany({
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
          upvotesCount: fb._count.upvotes,
          interactionsCount
        };
      });
      return { roadmaps: realFeedbacks };
    }
  })
  .query("id", {
    input: z.object({ id: z.string() }),
    async resolve({ input }) {
      const feedbackInteractions = await db.feedback.findUnique({
        where: { id: input.id },
        select: {
          comments: {
            include: { replies: { include: { repliedTo: true, replyFrom: true } }, user: true }
          }
        }
      });
      const fb = await db.feedback.findUnique({
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
        upvotesCount: fb._count.upvotes,
        interactionsCount
      };
      return { feedback, interactions: feedbackInteractions };
    }
  })
  .mutation("new", {
    input: z.object({
      userId: z.string(),
      title: z.string(),
      category: z.nativeEnum(Category),
      description: z.string()
    }),
    async resolve({ input }) {
      const createdFeedback = db.feedback.create({
        data: input
      });
      return createdFeedback;
    }
  });
