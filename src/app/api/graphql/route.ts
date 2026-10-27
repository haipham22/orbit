import { createYoga } from "graphql-yoga";
import { getUser } from "@/server/auth/current-user";
import { schema } from "@/server/graphql/schema";
import { createContext } from "@/server/graphql/context";

export const runtime = "nodejs";

const yoga = createYoga({
  schema,
  context: createContext,
  graphqlEndpoint: "/api/graphql",
  graphiql: process.env.NODE_ENV !== "production",
});

export async function GET(req: Request) {
  return yoga.fetch(req);
}

export async function POST(req: Request) {
  if (!(await getUser())) {
    return Response.json(
      { errors: [{ message: "Unauthenticated", extensions: { code: "UNAUTHENTICATED" } }] },
      { status: 401 },
    );
  }
  return yoga.fetch(req);
}
