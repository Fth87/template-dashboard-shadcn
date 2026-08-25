import type { z } from "zod"

import type { POST_STATUSES } from "../constants/post.constants"
import type {
  createPostSchema,
  postsListQuerySchema,
  updatePostSchema,
} from "../schemas/post.schema"

export type PostStatus = (typeof POST_STATUSES)[number]

export interface Post {
  id: string
  title: string
  /** Konten sebagai string JSON Tiptap. */
  content: string
  status: PostStatus
  /** Tanggal ISO 8601. */
  createdAt: string
  /** Tanggal ISO 8601. */
  updatedAt: string
}

export type CreatePostInput = z.infer<typeof createPostSchema>
export type UpdatePostInput = z.infer<typeof updatePostSchema>
export type PostsListParams = z.output<typeof postsListQuerySchema>

export type PostFormValues = CreatePostInput
