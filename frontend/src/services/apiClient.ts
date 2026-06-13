export type ApiError = {
  status: number;
  message: string;
  details?: unknown;
};

const BASE = (import.meta.env.VITE_API_BASE_URL as string) || '';

async function parseJson<T>(res: Response): Promise<T> {
  const text = await res.text();
  try {
    return JSON.parse(text) as T;
  } catch {
    // If not json, return as any
    return (text as unknown) as T;
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(BASE + path, {
    headers: {
      'content-type': 'application/json',
      ...(init?.headers || {}),
    },
    credentials: 'include',
    ...init,
  });

  if (!res.ok) {
    const body = await parseJson<unknown>(res).catch(() => undefined);
    const err: ApiError = { status: res.status, message: res.statusText || 'Request failed', details: body };
    throw err;
  }

  return parseJson<T>(res);
}

export const api = {
  get: <T>(path: string) => request<T>(path, { method: 'GET' }),
  post: <T>(path: string, body?: unknown) => request<T>(path, { method: 'POST', body: body ? JSON.stringify(body) : undefined }),
  put: <T>(path: string, body?: unknown) => request<T>(path, { method: 'PUT', body: body ? JSON.stringify(body) : undefined }),
  del: <T>(path: string) => request<T>(path, { method: 'DELETE' }),
};

export default api;
