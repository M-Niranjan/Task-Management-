const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("tm-token");
}

// In-flight request deduplication and TTL memory cache
const cache = new Map<string, { data: any; expiry: number }>();
const inFlight = new Map<string, Promise<any>>();
const CACHE_TTL_MS = 10000; // 10s fresh cache for GET requests

export function invalidateCache(prefix?: string) {
  if (!prefix) {
    cache.clear();
    return;
  }
  for (const key of cache.keys()) {
    if (key.includes(prefix)) cache.delete(key);
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const isGet = !options.method || options.method.toUpperCase() === "GET";
  const cacheKey = `${path}`;

  // Serve from cache if fresh
  if (isGet) {
    const cached = cache.get(cacheKey);
    if (cached && cached.expiry > Date.now()) {
      return cached.data as T;
    }

    // Deduplicate simultaneous in-flight GET requests
    if (inFlight.has(cacheKey)) {
      return inFlight.get(cacheKey)! as Promise<T>;
    }
  }

  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const fetchPromise = (async () => {
    try {
      const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
      if (!res.ok) throw new Error(`API error: ${res.status}`);
      const data = await res.json();

      if (isGet) {
        cache.set(cacheKey, { data, expiry: Date.now() + CACHE_TTL_MS });
      } else {
        // Invalidate relevant cache on mutations
        if (path.startsWith("/tasks")) invalidateCache("/tasks");
        if (path.startsWith("/projects")) invalidateCache("/projects");
      }

      return data as T;
    } finally {
      if (isGet) inFlight.delete(cacheKey);
    }
  })();

  if (isGet) inFlight.set(cacheKey, fetchPromise);

  return fetchPromise;
}

export const api = {
  auth: {
    guest: () => request<{ user: object; token: string }>("/auth/guest", { method: "POST" }),
  },
  tasks: {
    list: (projectId?: string) =>
      request<object[]>(`/tasks${projectId ? `?projectId=${projectId}` : ""}`),
    create: (data: object) => request<object>("/tasks", { method: "POST", body: JSON.stringify(data) }),
    update: (id: string, data: object) =>
      request<object>(`/tasks/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
    delete: (id: string) => request<void>(`/tasks/${id}`, { method: "DELETE" }),
    addComment: (id: string, content: string) =>
      request<object>(`/tasks/${id}/comments`, { method: "POST", body: JSON.stringify({ content }) }),
  },
  projects: {
    list: () => request<object[]>("/projects"),
    create: (data: object) => request<object>("/projects", { method: "POST", body: JSON.stringify(data) }),
    update: (id: string, data: object) =>
      request<object>(`/projects/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
    delete: (id: string) => request<void>(`/projects/${id}`, { method: "DELETE" }),
  },
};
