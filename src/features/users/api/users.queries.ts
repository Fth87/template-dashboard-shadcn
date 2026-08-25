import { keepPreviousData, queryOptions } from "@tanstack/react-query"

import { fetchUsersList } from "./users.api"
import type { UsersListParams } from "../types/user.types"

/**
 * Query key hierarchy:
 * ['users']                     → invalidasi apa pun terkait users
 * ['users', 'list']             → invalidasi semua list
 * ['users', 'list', params]     → cache per kombinasi parameter
 */
export const usersKeys = {
  all: ["users"] as const,
  lists: () => [...usersKeys.all, "list"] as const,
  list: (params: UsersListParams) => [...usersKeys.lists(), params] as const,
  details: () => [...usersKeys.all, "detail"] as const,
  detail: (id: string) => [...usersKeys.details(), id] as const,
}

/**
 * Factory query options (pola rekomendasi TanStack Query v5).
 * Satu objek memuat queryKey + queryFn agar konsisten dan mudah dites.
 */
export const usersQueries = {
  list: (params: UsersListParams) =>
    queryOptions({
      queryKey: usersKeys.list(params),
      queryFn: () => fetchUsersList(params),
      // Saat pindah halaman/filter, tampilkan data sebelumnya
      // sampai data baru datang — pagination terasa instan.
      placeholderData: keepPreviousData,
    }),
}
