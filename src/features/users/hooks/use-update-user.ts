import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { fetchUpdateUser } from "../api/users.api"
import { usersKeys } from "../api/users.queries"
import type { UpdateUserInput } from "../types/user.types"

interface UpdateUserVariables {
  id: string
  payload: UpdateUserInput
}

export function useUpdateUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: UpdateUserVariables) =>
      fetchUpdateUser(id, payload),
    onSuccess: async (updatedUser) => {
      toast.success(`Perubahan pada "${updatedUser.name}" tersimpan.`)
      await queryClient.invalidateQueries({ queryKey: usersKeys.lists() })
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Gagal menyimpan perubahan.",
      )
    },
  })
}
