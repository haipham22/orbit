import { GraphQLError } from "graphql";
import { builder } from "./builder";

builder.queryType({
  fields: (t) => ({
    hello: t.string({
      resolve: () => "orbit",
    }),
    me: t.string({
      resolve: (_root, _args, ctx) => {
        if (!ctx.user) {
          throw new GraphQLError("Unauthenticated", {
            extensions: { code: "UNAUTHENTICATED" },
          });
        }
        return ctx.user.email;
      },
    }),
  }),
});

export const schema = builder.toSchema();
