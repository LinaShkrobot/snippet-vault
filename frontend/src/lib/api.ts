import type {
  CreateSnippetInput,
  FindSnippetsQuery,
  Snippet,
  SnippetsResponse,
  UpdateSnippetInput,
} from './types';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public details?: unknown,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function request<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
    cache: 'no-store',
  });

  if (!res.ok) {
    let body: unknown = null;
    try {
      body = await res.json();
    } catch {
      // not JSON, ignore
    }
    const message =
      (body as { message?: string | string[] })?.message?.toString() ??
      `Request failed with status ${res.status}`;
    throw new ApiError(res.status, message, body);
  }

  if (res.status === 204) {
    return undefined as T;
  }

  return (await res.json()) as T;
}

export function buildQueryString(query: FindSnippetsQuery): string {
  const params = new URLSearchParams();
  if (query.q) params.set('q', query.q);
  if (query.tag) params.set('tag', query.tag);
  if (query.page) params.set('page', String(query.page));
  if (query.limit) params.set('limit', String(query.limit));
  const s = params.toString();
  return s ? `?${s}` : '';
}

export function getSnippets(
  query: FindSnippetsQuery = {},
): Promise<SnippetsResponse> {
  return request<SnippetsResponse>(`/snippets${buildQueryString(query)}`);
}

export function getSnippet(id: string): Promise<Snippet> {
  return request<Snippet>(`/snippets/${id}`);
}

export function createSnippet(input: CreateSnippetInput): Promise<Snippet> {
  return request<Snippet>(`/snippets`, {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export function updateSnippet(
  id: string,
  input: UpdateSnippetInput,
): Promise<Snippet> {
  return request<Snippet>(`/snippets/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(input),
  });
}

export function deleteSnippet(id: string): Promise<void> {
  return request<void>(`/snippets/${id}`, { method: 'DELETE' });
}

export { ApiError };
