import { createProtectedRouter } from "./../create-protected-router";
import { z } from "zod";

export const commentRouter = createProtectedRouter
  .mutation("new", {
    input: z.object({
      userId: z.string(),
      feedbackId: z.string(),
      content: z.string()
    }),
    async resolve({ input, ctx }) {
      const newComment = await ctx.prisma.comment.create({
        data: input
      });
      return newComment;
    }
  })
  .mutation("reply", {
    input: z.object({
      replyFromId: z.string(),
      commentId: z.number(),
      repliedToId: z.string(),
      content: z.string()
    }),
    async resolve({ input, ctx }) {
      const newReply = await ctx.prisma.reply.create({
        data: input
      });
      return newReply;
    }
  });
