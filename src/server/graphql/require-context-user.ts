import { GraphQLError } from "graphql";
import { ERROR_CODES } from "@/server/error-codes";
import type { Context } from "./context";
import type { AuthUser } from "@/server/auth/types";

export function requireContextUser(ctx: Context): AuthUser {
  if (!ctx.user) {
    throw new GraphQLError("Unauthenticated", {
      extensions: { code: ERROR_CODES.UNAUTHENTICATED },
    });
  }
  return ctx.user;
}
