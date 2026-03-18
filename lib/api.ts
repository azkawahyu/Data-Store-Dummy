export async function apiFetch(url: string, options: RequestInit = {}) {
  const token = localStorage.getItem("token");

  function parseJwt(token?: string) {
    try {
      if (!token) return null;
      const p = token.split(".")[1];
      if (!p) return null;
      return JSON.parse(atob(p.replace(/-/g, "+").replace(/_/g, "/")));
    } catch {
      return null;
    }
  }

  const payload = parseJwt(token ?? undefined) || {};
  const hasToken = typeof token === "string" && token.length > 0;

  const isFormData =
    typeof FormData !== "undefined" && options.body instanceof FormData;

  const rawHeaders = {
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    Authorization: hasToken ? `Bearer ${token}` : undefined,
    "x-user-id": hasToken
      ? ((payload?.userId ?? payload?.sub) as string | undefined)
      : undefined,
    "x-user-role": hasToken ? (payload?.role as string | undefined) : undefined,
    ...(options.headers || {}),
  };

  // Filter out undefined values to ensure HeadersInit is valid
  const headers: Record<string, string> = Object.fromEntries(
    Object.entries(rawHeaders).filter(([, v]) => typeof v === "string"),
  );

  const normalizedUrl = url.startsWith("/") ? url : `/${url}`;

  const res = await fetch(normalizedUrl, {
    ...options,
    headers,
  });

  if (res.status === 401) {
    localStorage.removeItem("token");
    window.location.href = "/login";
  }

  return res.json();
}
