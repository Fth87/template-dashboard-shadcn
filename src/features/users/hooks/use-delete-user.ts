import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { fetchDeleteUser } from "../api/users.api"
import { usersKeys } from "../api/users.queries"

export function useDeleteUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => fetchDeleteUser(id),
    onSuccess: async () => {
      toast.success("Pengguna berhasil dihapus.")
      await queryClient.invalidateQueries({ queryKey: usersKeys.lists() })
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Gagal menghapus pengguna.",
      )
    },
  })
}
