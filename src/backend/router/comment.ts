import { createProtectedRouter } from "./../create-protected-router";
import { z } from "zod";

export const commentRouter = createProtectedRouter
  .mutation("new", {
    input: z.object({
      feedbackId: z.string(),
      content: z.string()
    }),
    async resolve({ input, ctx }) {
      const userId = ctx.session.user.id;
      const newComment = await ctx.prisma.comment.create({
        data: { ...input, userId }
      });
      return newComment;
    }
  })
  .mutation("reply", {
    input: z.object({
      commentId: z.number(),
      repliedToId: z.string(),
      content: z.string()
    }),
    async resolve({ input, ctx }) {
      const userId = ctx.session.user.id;
      const newReply = await ctx.prisma.reply.create({
        data: { ...input, replyFromId: userId }
      });
      return newReply;
    }
  });
