import type { z } from "zod"

import {
  USER_ROLES,
  USER_STATUSES,
} from "../constants/user.constants"
import type {
  createUserSchema,
  updateUserSchema,
  usersListQuerySchema,
} from "../schemas/user.schema"

export type UserStatus = (typeof USER_STATUSES)[number]
export type UserRole = (typeof USER_ROLES)[number]

/** Data user yang dikirim API (sudah termasuk metadata sistem). */
export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  status: UserStatus
  /** Tanggal ISO 8601. */
  createdAt: string
  /** Tanggal ISO 8601. */
  updatedAt: string
}

/** Payload membuat user (body POST /api/users). */
export type CreateUserInput = z.infer<typeof createUserSchema>

/** Payload mengubah sebagian data user (body PATCH /api/users/:id). */
export type UpdateUserInput = z.infer<typeof updateUserSchema>

/** Parameter list yang sudah tervalidasi & siap dipakai fetch/query. */
export type UsersListParams = z.output<typeof usersListQuerySchema>

/** Nilai form create/edit user. */
export type UserFormValues = CreateUserInput
