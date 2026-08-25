import { useQuery } from "@tanstack/react-query"

import { usersQueries } from "../api/users.queries"
import type { UsersListParams } from "../types/user.types"

/** Hook untuk mengambil list user sesuai params URL saat ini. */
export function useUsersList(params: UsersListParams) {
  return useQuery(usersQueries.list(params))
}
