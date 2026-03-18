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

  const isFormData =
    typeof FormData !== "undefined" && options.body instanceof FormData;

  const rawHeaders = {
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    Authorization: `Bearer ${token}`,
    "x-user-id": (payload?.userId ?? payload?.sub) || undefined,
    "x-user-role": payload?.role || undefined,
    ...(options.headers || {}),
  };

  // Filter out undefined values to ensure HeadersInit is valid
  const headers: Record<string, string> = Object.fromEntries(
    Object.entries(rawHeaders).filter(([_, v]) => typeof v === "string"),
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
