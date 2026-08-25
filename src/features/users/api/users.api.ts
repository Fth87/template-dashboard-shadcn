import type { PaginatedResponse } from "@/types/api"

import type {
  CreateUserInput,
  UpdateUserInput,
  User,
  UsersListParams,
} from "../types/user.types"
import { usersMockStore } from "./users.mock"

/**
 * Layer API fitur users — satu-satunya tempat yang menyentuh "backend".
 *
 * Mode saat ini: **full client-side** (deploy statis). Semua fungsi
 * mendelegasikan ke mock store in-browser dengan latensi simulasi.
 *
 * Cara ganti ke backend nyata (mis. REST API):
 * 1. Ganti isi fungsi-fungsi di bawah menjadi panggilan `apiFetch(...)`
 *    dari `@/lib/api-client` (panduan lengkap: `docs/mock-api.md`).
 * 2. Hapus file `users.mock.ts`.
 *
 * Tidak ada hooks/komponen yang perlu berubah.
 */

export async function fetchUsersList(
  params: UsersListParams,
): Promise<PaginatedResponse<User>> {
  return usersMockStore.list(params)
}

export async function fetchCreateUser(payload: CreateUserInput): Promise<User> {
  return usersMockStore.create(payload)
}

export async function fetchUpdateUser(
  id: string,
  payload: UpdateUserInput,
): Promise<User> {
  return usersMockStore.update(id, payload)
}

export async function fetchDeleteUser(id: string): Promise<void> {
  return usersMockStore.remove(id)
}
