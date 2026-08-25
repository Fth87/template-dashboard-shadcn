import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { fetchCreatePost } from "../api/posts.api"
import { postsKeys } from "../api/posts.queries"
import type { CreatePostInput } from "../types/post.types"

export function useCreatePost() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreatePostInput) => fetchCreatePost(payload),
    onSuccess: async (createdPost) => {
      toast.success(`Artikel "${createdPost.title}" berhasil ditambahkan.`)
      await queryClient.invalidateQueries({ queryKey: postsKeys.lists() })
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Gagal menambahkan artikel.",
      )
    },
  })
}
