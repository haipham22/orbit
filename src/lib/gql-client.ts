export async function gql<T>(query: string, variables?: Record<string, unknown>): Promise<T> {
  const res = await fetch("/api/graphql", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ query, variables }),
  });

  const body = await res.json().catch(() => null);

  if (res.status === 401) {
    throw new Error("Phiên đăng nhập hết hạn — hãy đăng nhập lại");
  }
  if (!res.ok) {
    throw new Error(body?.errors?.[0]?.message ?? `HTTP ${res.status}`);
  }
  if (body.errors?.length) {
    throw new Error(body.errors[0].message);
  }
  return body.data as T;
}
