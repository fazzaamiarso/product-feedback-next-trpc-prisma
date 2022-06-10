import { createRouter } from "./create-router";
import { feedbackRouter } from "./router/feedback";
import superjson from "superjson";

export const appRouter = createRouter.transformer(superjson).merge("feedback.", feedbackRouter);
