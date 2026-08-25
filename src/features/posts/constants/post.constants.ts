export const POST_STATUSES = ["draft", "published"] as const

export const POST_STATUS_OPTIONS: ReadonlyArray<{
  value: PostStatus
  label: string
}> = [
  { value: "draft", label: "Draft" },
  { value: "published", label: "Terbit" },
]

/** Kolom yang boleh dipakai untuk sorting di penyedia data. */
export const POSTS_SORTABLE_FIELDS = [
  "title",
  "status",
  "createdAt",
] as const

export const SORT_DIRECTIONS = ["asc", "desc"] as const

export const DEFAULT_POSTS_SORT = {
  sortBy: "createdAt",
  sortDir: "desc",
} as const

export type PostStatus = (typeof POST_STATUSES)[number]
