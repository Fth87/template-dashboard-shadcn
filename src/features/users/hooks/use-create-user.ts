import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { fetchCreateUser } from "../api/users.api"
import { usersKeys } from "../api/users.queries"
import type { CreateUserInput } from "../types/user.types"

export function useCreateUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateUserInput) => fetchCreateUser(payload),
    onSuccess: async (createdUser) => {
      toast.success(`Pengguna "${createdUser.name}" berhasil ditambahkan.`)
      await queryClient.invalidateQueries({ queryKey: usersKeys.lists() })
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Gagal menambahkan pengguna.",
      )
    },
  })
}
