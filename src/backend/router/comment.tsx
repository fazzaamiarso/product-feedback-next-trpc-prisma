import db from "@/db";
import { createRouter } from "backend/create-router";
import { z } from "zod";

export const commentRouter = createRouter
  .mutation("new", {
    input: z.object({
      userId: z.string(),
      feedbackId: z.string(),
      content: z.string()
    }),
    async resolve({ input }) {
      const newComment = await db.comment.create({
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
    async resolve({ input }) {
      const newReply = await db.reply.create({
        data: input
      });
      return newReply;
    }
  });
