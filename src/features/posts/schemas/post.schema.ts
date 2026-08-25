import { z } from "zod"

import { isTiptapDocEmpty } from "@/components/rich-text-editor"

import {
  POST_STATUSES,
  POSTS_SORTABLE_FIELDS,
  SORT_DIRECTIONS,
} from "../constants/post.constants"

export const postStatusSchema = z.enum(POST_STATUSES)

/**
 * Konten artikel disimpan sebagai string JSON Tiptap.
 * Wajib berupa dokumen valid DAN tidak kosong.
 */
export const postContentSchema = z
  .string()
  .refine(
    (value) => !isTiptapDocEmpty(value),
    { message: "Konten artikel wajib diisi." },
  )

export const createPostSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Judul minimal 3 karakter.")
    .max(120, "Judul maksimal 120 karakter."),
  status: postStatusSchema,
  content: postContentSchema,
})

export const updatePostSchema = createPostSchema.partial()

/** Kontrak query params untuk endpoint list (pola sama dengan users). */
export const postsListQuerySchema = z.object({
  q: z.string().trim().max(100).catch("").default(""),
  status: postStatusSchema.optional().catch(undefined),
  sortBy: z.enum(POSTS_SORTABLE_FIELDS).catch("createdAt").default("createdAt"),
  sortDir: z.enum(SORT_DIRECTIONS).catch("desc").default("desc"),
  page: z.coerce.number().int().min(1).catch(1),
  perPage: z.coerce.number().int().min(1).max(100).catch(10),
})
