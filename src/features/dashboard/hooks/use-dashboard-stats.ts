import { useQuery } from "@tanstack/react-query"

// Lintas feature WAJIB lewat barrel publik (lihat docs/architecture.md).
import {
  fetchUsersList,
  usersKeys,
} from "@/features/users"

export interface DashboardStats {
  total: number
  active: number
  inactive: number
  suspended: number
}

/**
 * Statistik dashboard dihitung dari data list (client-side).
 * Query key terpisah ('stats') agar tidak menabrak cache list,
 * tetapi tetap di bawah ['users'] sehingga ikut tervalidasi
 * ketika ada mutasi users.
 */
export function useDashboardStats() {
  return useQuery({
    queryKey: [...usersKeys.all, "stats"] as const,
    queryFn: async (): Promise<DashboardStats> => {
      // Ambil semua baris dalam satu permintaan untuk menghitung ringkasan.
      const response = await fetchUsersList({
        q: "",
        sortBy: "createdAt",
        sortDir: "desc",
        page: 1,
        perPage: 9999,
      })

      const counts: DashboardStats = {
        total: response.meta.totalItems,
        active: 0,
        inactive: 0,
        suspended: 0,
      }

      for (const user of response.items) {
        counts[user.status] += 1
      }

      return counts
    },
    staleTime: 30_000,
  })
}
