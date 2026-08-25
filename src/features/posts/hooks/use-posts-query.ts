import { useQuery } from "@tanstack/react-query"

import { postsQueries } from "../api/posts.queries"
import type { PostsListParams } from "../types/post.types"

export function usePostsList(params: PostsListParams) {
  return useQuery(postsQueries.list(params))
}
