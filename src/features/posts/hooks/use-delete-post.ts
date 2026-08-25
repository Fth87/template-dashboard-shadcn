import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { fetchDeletePost } from "../api/posts.api"
import { postsKeys } from "../api/posts.queries"

export function useDeletePost() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => fetchDeletePost(id),
    onSuccess: async () => {
      toast.success("Artikel berhasil dihapus.")
      await queryClient.invalidateQueries({ queryKey: postsKeys.lists() })
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Gagal menghapus artikel.",
      )
    },
  })
}
