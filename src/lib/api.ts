const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("tm-token");
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
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
