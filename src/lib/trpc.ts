import { inferProcedureOutput, inferProcedureInput } from "@trpc/server";
import { AppRouter } from "./../pages/api/trpc/[trpc]";

export type TQuery = keyof AppRouter["_def"]["queries"];
export type TMutation = keyof AppRouter["_def"]["mutations"];

export type InferQueryOutput<TRouteKey extends TQuery> = inferProcedureOutput<
  AppRouter["_def"]["queries"][TRouteKey]
>;

export type InferQueryInput<TRouteKey extends TQuery> = inferProcedureInput<
  AppRouter["_def"]["queries"][TRouteKey]
>;

export type InferMutationInput<TRouteKey extends TMutation> = inferProcedureInput<
  AppRouter["_def"]["mutations"][TRouteKey]
>;
