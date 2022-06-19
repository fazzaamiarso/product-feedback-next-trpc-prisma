import { createProtectedRouter } from "./../create-protected-router";

const userRouter = createProtectedRouter.query("details", {
  async resolve() {
    return null;
  }
});
