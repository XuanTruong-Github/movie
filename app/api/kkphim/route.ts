import { KKPHIM_BASE_URL } from "@/lib/kkphim";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const path = url.searchParams.get("path");

  if (!path || !path.startsWith("/")) {
    return Response.json({ message: "Missing valid path parameter." }, { status: 400 });
  }

  const upstream = new URL(path, KKPHIM_BASE_URL);
  url.searchParams.forEach((value, key) => {
    if (key !== "path") upstream.searchParams.set(key, value);
  });

  const response = await fetch(upstream, {
    headers: { Accept: "application/json" },
    next: { revalidate: 300 },
  });

  const body = await response.text();
  return new Response(body, {
    status: response.status,
    headers: {
      "content-type": response.headers.get("content-type") ?? "application/json; charset=utf-8",
      "cache-control": "s-maxage=300, stale-while-revalidate=600",
    },
  });
}
