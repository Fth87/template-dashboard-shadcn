import { z } from "zod"

import {
  SORT_DIRECTIONS,
  USER_ROLES,
  USER_STATUSES,
  USERS_SORTABLE_FIELDS,
} from "../constants/user.constants"

/**
 * Kontrak data user. Dipakai bersama oleh:
 * - Form client (React Hook Form + zodResolver)
 * - Route handler server (validasi body)
 *
 * Jadi aturan validasi hanya ditulis satu kali.
 */
export const userStatusSchema = z.enum(USER_STATUSES)
export const userRoleSchema = z.enum(USER_ROLES)

export const createUserSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Nama minimal 3 karakter.")
    .max(64, "Nama maksimal 64 karakter."),
  email: z.email("Format email tidak valid."),
  role: userRoleSchema,
  status: userStatusSchema,
})

export const updateUserSchema = createUserSchema.partial()

/**
 * Kontrak query params untuk endpoint list.
 * Route handler memakai ini untuk memvalidasi URL sebelum diproses,
 * sehingga nilai tidak valid langsung ditolak dengan 400.
 */
export const usersListQuerySchema = z.object({
  q: z.string().trim().max(100).catch("").default(""),
  status: userStatusSchema.optional().catch(undefined),
  role: userRoleSchema.optional().catch(undefined),
  sortBy: z.enum(USERS_SORTABLE_FIELDS).catch("createdAt").default("createdAt"),
  sortDir: z.enum(SORT_DIRECTIONS).catch("desc").default("desc"),
  page: z.coerce.number().int().min(1).catch(1),
  perPage: z.coerce.number().int().min(1).max(100).catch(10),
})
