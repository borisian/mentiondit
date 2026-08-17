/**
 * The single outbound HTTP path. Authentication headers, 401 handling and quota
 * errors belong here when accounts land — no feature should call fetch directly.
 */
export async function post<T>(path: string, body: unknown): Promise<T> {
  const response = await fetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(payload?.error ?? "La requête a échoué. Réessayez.");
  }

  return payload as T;
}
