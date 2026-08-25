import { useQuery } from "@tanstack/react-query"

import { postsQueries } from "../api/posts.queries"

interface UsePostDetailOptions {
  /** False = jangan fetch (mis. id belum tersedia dari URL). */
  enabled?: boolean
}

/** Ambil satu artikel by id (untuk halaman edit). */
export function usePostDetail(
  id: string,
  options: UsePostDetailOptions = {},
) {
  const { enabled = true } = options

  return useQuery({
    ...postsQueries.detail(id),
    enabled: enabled && id !== "",
  })
}
