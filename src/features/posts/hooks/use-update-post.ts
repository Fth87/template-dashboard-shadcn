import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { fetchUpdatePost } from "../api/posts.api"
import { postsKeys } from "../api/posts.queries"
import type { UpdatePostInput } from "../types/post.types"

interface UpdatePostVariables {
  id: string
  payload: UpdatePostInput
}

export function useUpdatePost() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: UpdatePostVariables) =>
      fetchUpdatePost(id, payload),
    onSuccess: async (updatedPost) => {
      toast.success(`Perubahan pada "${updatedPost.title}" tersimpan.`)
      await queryClient.invalidateQueries({ queryKey: postsKeys.lists() })
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Gagal menyimpan perubahan.",
      )
    },
  })
}
