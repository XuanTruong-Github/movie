"use server";
export async function api(
  url: string | URL | globalThis.Request,
  options?: RequestInit,
) {
  const baseUrl = process.env.BASE_URL || "";
  return fetch(`${baseUrl}/v1/api${url}`, options);
}
