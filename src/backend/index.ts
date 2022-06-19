import { userRouter } from "./router/user";
import { createRouter } from "./create-router";
import { feedbackRouter } from "./router/feedback";
import superjson from "superjson";
import { commentRouter } from "./router/comment";

export const appRouter = createRouter
  .transformer(superjson)
  .merge("feedback.", feedbackRouter)
  .merge("comment.", commentRouter)
  .merge("user.", userRouter);
