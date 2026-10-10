export const VITE_USE_BACKEND = (import.meta.env.VITE_USE_BACKEND ?? 'true') === 'true';

const API_BASE = import.meta.env.VITE_API_BASE ?? '/api';

export async function apiGet<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`);
  if (!res.ok) {
    throw new Error(`API request failed: ${res.statusText}`);
  }
  return res.json() as Promise<T>;
}

export async function apiPost<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    throw new Error(`API request failed: ${res.statusText}`);
  }
  return res.json() as Promise<T>;
}

export const backendClient = {
  getHealth: () => apiGet<{status: string; service: string; backend: string}>('/health'),
  getMetadata: () => apiGet<any>('/metadata'),
  getPageData: (pageId: string, filters?: Record<string, string>) => apiGet<any>(`/data/${pageId}${filters ? `?filters=${encodeURIComponent(JSON.stringify(filters))}` : ''}`),
  chat: (message: string, uiState?: Record<string, unknown>) => apiPost<any>('/agent/chat', {message, ui_state: uiState || {}}),
  confirm: (messageId?: string, accepted = true) => apiPost<any>('/agent/confirm', {message_id: messageId, accepted}),
};
