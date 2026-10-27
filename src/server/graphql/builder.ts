import SchemaBuilder from "@pothos/core";
import type { Context } from "./context";

export const builder = new SchemaBuilder<{
  Context: Context;
  AuthUser: { id: string; email: string };
}>({});

builder.queryType({});
