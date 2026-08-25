import { QueryClient } from "@tanstack/react-query"

/**
 * Factory QueryClient untuk aplikasi full client-side.
 *
 * Instance dibuat per-mount browser lewat `useState` di Providers —
 * pola resmi TanStack Query untuk SPA/static export.
 */
export function makeQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30_000,
        refetchOnWindowFocus: false,
        retry: 1,
      },
    },
  })
}
