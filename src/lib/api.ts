/**
 * API client for IFT CMS backend.
 * Base URL from VITE_API_URL:
 * - http://localhost:8000 = direct (CORS required)
 * - /api or empty (in dev) = Vite proxy → same-origin, no CORS
 */

const API_BASE =
  (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_API_URL) ||
  '';

export type ResourceVersion = 'Draft' | 'Published';

export interface AuthorRef {
  user_id: string;
  authorship: 'Owner' | 'Author' | 'Contributor';
}

export interface ResourceIn {
  authors: AuthorRef[];
  tags: string[];
  title: string;
  subtitle: string;
  abstract: string;
  logo: string;
  banner: string;
  content: Record<string, unknown>[];
  bibliography: string;
}

export interface ResourceOut extends ResourceIn {
  slug: string;
  last_updated: string;
  version: ResourceVersion | 'Deleted';
  uid?: string;
}

export interface PermissionsOut {
  read: boolean;
  update: boolean;
  delete: boolean;
  publish: boolean;
}

function getAuthHeaders(): HeadersInit {
  const token = sessionStorage.getItem('ift_auth_token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

function getUrl(path: string, params?: Record<string, string>): string {
  let href: string;
  if (API_BASE.startsWith('http')) {
    href = new URL(path, API_BASE).toString();
  } else {
    const base = API_BASE.endsWith('/') ? API_BASE.slice(0, -1) : API_BASE;
    href = base + (path.startsWith('/') ? path : '/' + path);
  }
  if (params) {
    const u = new URL(href, href.startsWith('http') ? undefined : 'http://dummy');
    Object.entries(params).forEach(([k, v]) => u.searchParams.set(k, v));
    return href.startsWith('http') ? u.toString() : u.pathname + u.search;
  }
  return href;
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(typeof err.detail === 'string' ? err.detail : JSON.stringify(err.detail));
  }
  const ct = res.headers.get('content-type');
  if (ct?.includes('application/json')) {
    return res.json();
  }
  return res.text() as Promise<T>;
}

export function isApiConfigured(): boolean {
  return !!API_BASE;
}

/** Base URL for API (for building auth URLs etc.). */
export function getApiBase(): string {
  return API_BASE;
}

/** Fetch current user from /auth/me. Returns null if not authenticated. */
export async function getAuthUser(): Promise<{
  user_id: string;
  username: string;
  email: string;
  groups: string[];
  is_admin: boolean;
} | null> {
  if (!API_BASE) return null;
  try {
    const res = await fetch(getUrl('/auth/me'), {
      credentials: 'include',
      headers: getAuthHeaders(),
    });
    const data = await res.json();
    return data.user ?? null;
  } catch {
    return null;
  }
}

/** Logout (clear backend cookie). */
export async function apiLogout(): Promise<void> {
  if (!API_BASE) return;
  try {
    await fetch(getUrl('/auth/logout'), {
      method: 'POST',
      credentials: 'include',
    });
  } catch {
    // ignore
  }
}

export async function getResource(
  slug: string,
  version: ResourceVersion = 'Published'
): Promise<ResourceOut> {
  const url = getUrl(`/resources/${encodeURIComponent(slug)}`, { version });
  const res = await fetch(url, { headers: getAuthHeaders() });
  return handleResponse<ResourceOut>(res);
}

/** Like getResource but returns null on 404 instead of throwing. Use for "resource may not exist" flows (e.g. migration). */
export async function getResourceOptional(
  slug: string,
  version: ResourceVersion = 'Published'
): Promise<ResourceOut | null> {
  const url = getUrl(`/resources/${encodeURIComponent(slug)}`, { version });
  const res = await fetch(url, { headers: getAuthHeaders() });
  if (res.status === 404) return null;
  return handleResponse<ResourceOut>(res);
}

export async function createResource(
  slug: string,
  data: ResourceIn
): Promise<ResourceOut> {
  const url = getUrl(`/resources/${encodeURIComponent(slug)}`);
  const bodyStr = JSON.stringify(data);
  let res: Response;
  try {
    res = await fetch(url, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: bodyStr,
      credentials: 'include',
    });
  } catch (e) {
    throw e;
  }
  return handleResponse<ResourceOut>(res);
}

export async function updateResource(
  slug: string,
  data: ResourceIn
): Promise<ResourceOut> {
  const url = getUrl(`/resources/${encodeURIComponent(slug)}`);
  const res = await fetch(url, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
    credentials: 'include',
  });
  return handleResponse<ResourceOut>(res);
}

export async function sendForReview(slug: string): Promise<{ status: string; slug: string }> {
  const url = getUrl(`/resources/${encodeURIComponent(slug)}`);
  const res = await fetch(url, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    credentials: 'include',
  });
  return handleResponse<{ status: string; slug: string }>(res);
}

export async function publishResource(slug: string): Promise<ResourceOut> {
  const url = getUrl(`/publish_resources/${encodeURIComponent(slug)}`);
  const res = await fetch(url, {
    method: 'GET',
    headers: getAuthHeaders(),
    credentials: 'include',
  });
  return handleResponse<ResourceOut>(res);
}

export async function deleteResource(
  slug: string,
  soft = true
): Promise<{ status: string; slug: string }> {
  const url = getUrl(`/resources/${encodeURIComponent(slug)}`, { soft: String(soft) });
  const res = await fetch(url, {
    method: 'DELETE',
    headers: getAuthHeaders(),
    credentials: 'include',
  });
  return handleResponse<{ status: string; slug: string }>(res);
}

export async function moveResource(
  slug: string,
  newSlug: string
): Promise<{ status: string; slug: string; new_slug: string }> {
  const url = getUrl('/resource_move', { slug, new_slug: newSlug });
  const res = await fetch(url, {
    method: 'PUT',
    headers: getAuthHeaders(),
    credentials: 'include',
  });
  return handleResponse(res);
}

export async function getPermissions(slug: string): Promise<PermissionsOut> {
  const url = getUrl(`/resources/${encodeURIComponent(slug)}`);
  const res = await fetch(url, {
    method: 'OPTIONS',
    headers: getAuthHeaders(),
    credentials: 'include',
  });
  return handleResponse<PermissionsOut>(res);
}

export interface SearchResult {
  slug: string;
  title: string;
  subtitle: string;
}

export async function searchResources(
  q: string,
  tags?: string[],
  limit = 50
): Promise<{ results: SearchResult[] }> {
  const params: Record<string, string> = { q, limit: String(limit) };
  if (tags?.length) params.tags = tags.join(',');
  const url = getUrl('/search', params);
  const res = await fetch(url, {
    headers: getAuthHeaders(),
    credentials: 'include',
  });
  return handleResponse<{ results: SearchResult[] }>(res);
}

/** Upload file. Returns { hash, url } - url is full URL for embedding. */
export async function uploadFile(file: File): Promise<{ hash: string; url: string }> {
  const formData = new FormData();
  formData.append('file', file);
  const headers: Record<string, string> = {};
  const token = sessionStorage.getItem('ift_auth_token');
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(getUrl('/upload'), {
    method: 'POST',
    headers,
    body: formData,
    credentials: 'include',
  });
  const data = await handleResponse<{ hash: string; url: string }>(res);
  return { ...data, url: `${API_BASE}${data.url}` };
}
