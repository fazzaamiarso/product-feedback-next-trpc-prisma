import { z } from "zod";
import { createProtectedRouter } from "./../create-protected-router";
import * as trpc from "@trpc/server";

export const userRouter = createProtectedRouter.mutation("username", {
  input: z.object({ username: z.string() }),
  async resolve({ ctx, input }) {
    const isUsernameTaken = await ctx.prisma.user.findUnique({
      where: { username: input.username }
    });
    if (isUsernameTaken)
      throw new trpc.TRPCError({ code: "BAD_REQUEST", message: "Username is taken!" });
    const updatedUser = await ctx.prisma.user.update({
      where: { id: ctx.session.user.id },
      data: { username: input.username }
    });
    return updatedUser;
  }
});
