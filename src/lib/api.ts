export const API_URL = import.meta.env.VITE_API_URL || '/api'

export async function fetchAPI<T = any>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const url = `${API_URL}${endpoint}`
  
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'API request failed')
  }

  return response.json()
}

export const api = {
  get: <T = any>(endpoint: string) => fetchAPI<T>(endpoint),
  post: <T = any>(endpoint: string, data: any) =>
    fetchAPI<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  put: <T = any>(endpoint: string, data: any) =>
    fetchAPI<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  patch: <T = any>(endpoint: string, data: any) =>
    fetchAPI<T>(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
  delete: <T = any>(endpoint: string) =>
    fetchAPI<T>(endpoint, {
      method: 'DELETE',
    }),
}
