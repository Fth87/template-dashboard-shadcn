import type { PaginatedResponse } from "@/types/api"

import type {
  CreatePostInput,
  Post,
  PostsListParams,
  UpdatePostInput,
} from "../types/post.types"
import { postsMockStore } from "./posts.mock"

/**
 * Layer API fitur posts — satu-satunya tempat yang menyentuh "backend".
 * Mode saat ini: full client-side (lihat `docs/mock-api.md` untuk cara
 * menukar isi file ini dengan panggilan `apiFetch` ke backend nyata).
 */

export async function fetchPostsList(
  params: PostsListParams,
): Promise<PaginatedResponse<Post>> {
  return postsMockStore.list(params)
}

export async function fetchPostById(id: string): Promise<Post> {
  return postsMockStore.getById(id)
}

export async function fetchCreatePost(payload: CreatePostInput): Promise<Post> {
  return postsMockStore.create(payload)
}

export async function fetchUpdatePost(
  id: string,
  payload: UpdatePostInput,
): Promise<Post> {
  return postsMockStore.update(id, payload)
}

export async function fetchDeletePost(id: string): Promise<void> {
  return postsMockStore.remove(id)
}
