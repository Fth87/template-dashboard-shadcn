/**
 * Sumber kebenaran tunggal untuk nilai domain user.
 * Schema zod, tipe TS, filter UI, dan mock DB semuanya
 * diturunkan dari konstanta ini.
 */

export const USER_STATUSES = ["active", "inactive", "suspended"] as const

export const USER_STATUS_OPTIONS: ReadonlyArray<{
  value: UserStatus
  label: string
}> = [
  { value: "active", label: "Aktif" },
  { value: "inactive", label: "Nonaktif" },
  { value: "suspended", label: "Ditangguhkan" },
]

export const USER_ROLES = ["admin", "editor", "viewer"] as const

export const USER_ROLE_OPTIONS: ReadonlyArray<{
  value: UserRole
  label: string
}> = [
  { value: "admin", label: "Admin" },
  { value: "editor", label: "Editor" },
  { value: "viewer", label: "Viewer" },
]

/** Kolom yang boleh dipakai untuk sorting di server. */
export const USERS_SORTABLE_FIELDS = [
  "name",
  "email",
  "status",
  "role",
  "createdAt",
] as const

export const SORT_DIRECTIONS = ["asc", "desc"] as const

export const DEFAULT_USERS_SORT = {
  sortBy: "createdAt",
  sortDir: "desc",
} as const

export type UserStatus = (typeof USER_STATUSES)[number]
export type UserRole = (typeof USER_ROLES)[number]
