import { builder } from "./builder";
import { requireContextUser } from "./require-context-user";
import "./types/people";
import "./types/journal";
import "./people-fields";
import "./people-mutations";
import "./journal-fields";

builder.queryType({
  fields: (t) => ({
    hello: t.string({
      resolve: () => "orbit",
    }),
    me: t.string({
      resolve: (_root, _args, ctx) => requireContextUser(ctx).email,
    }),
  }),
});

export const schema = builder.toSchema();
