import { keepPreviousData, queryOptions } from "@tanstack/react-query"

import { fetchPostById, fetchPostsList } from "./posts.api"
import type { PostsListParams } from "../types/post.types"

export const postsKeys = {
  all: ["posts"] as const,
  lists: () => [...postsKeys.all, "list"] as const,
  list: (params: PostsListParams) => [...postsKeys.lists(), params] as const,
  details: () => [...postsKeys.all, "detail"] as const,
  detail: (id: string) => [...postsKeys.details(), id] as const,
}

export const postsQueries = {
  list: (params: PostsListParams) =>
    queryOptions({
      queryKey: postsKeys.list(params),
      queryFn: () => fetchPostsList(params),
      placeholderData: keepPreviousData,
    }),
  detail: (id: string) =>
    queryOptions({
      queryKey: postsKeys.detail(id),
      queryFn: () => fetchPostById(id),
    }),
}
