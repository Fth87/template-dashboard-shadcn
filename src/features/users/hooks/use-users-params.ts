"use client"

import {
  createLoader,
  parseAsInteger,
  parseAsString,
  parseAsStringLiteral,
  useQueryStates,
} from "nuqs"

import {
  DEFAULT_USERS_SORT,
  SORT_DIRECTIONS,
  USER_ROLES,
  USER_STATUSES,
  USERS_SORTABLE_FIELDS,
} from "../constants/user.constants"
import { DEFAULT_PAGE_SIZE } from "@/components/data-table"
import type { UserStatus, UserRole, UsersListParams } from "../types/user.types"

/**
 * Kontrak query params URL untuk halaman users.
 *
 * Prinsip: URL adalah satu-satunya sumber kebenaran untuk state tabel.
 * Search, filter, sorting, dan pagination semuanya tersimpan di query
 * params sehingga tidak hilang saat di-refresh dan bisa dibagikan.
 *
 * Nilai filter disimpan sebagai string bebas ("", artinya "semua").
 * Validasi nilai akhir dilakukan `toUsersListParams` (client) dan
 * `usersListQuerySchema` (server) agar tipe tetap aman.
 */
export const usersSearchParams = {
  q: parseAsString.withDefault(""),
  status: parseAsString.withDefault(""),
  role: parseAsString.withDefault(""),
  sortBy: parseAsStringLiteral(USERS_SORTABLE_FIELDS).withDefault(
    DEFAULT_USERS_SORT.sortBy,
  ),
  sortDir: parseAsStringLiteral(SORT_DIRECTIONS).withDefault(
    DEFAULT_USERS_SORT.sortDir,
  ),
  page: parseAsInteger.withDefault(1),
  perPage: parseAsInteger.withDefault(DEFAULT_PAGE_SIZE),
}

/** Hook utama untuk baca/tulis state tabel dari/ke URL. */
export function useUsersParams() {
  const [params, setParams] = useQueryStates(usersSearchParams)
  return { params, setParams }
}

type UseUsersParamsReturn = ReturnType<typeof useUsersParams>

/** Nilai params yang sudah di-resolve (bukan parser). */
export type UsersParamsValues = UseUsersParamsReturn["params"]
/** Setter nuqs: nilai baru, partial update, atau null untuk kembali ke default. */
export type UsersParamsSetter = UseUsersParamsReturn["setParams"]

/**
 * Loader sisi server (opsional): mem-parse searchParams di Server Component.
 * Contoh: `const params = loadUsersSearchParams(await searchParams)`
 */
export const loadUsersParams = createLoader(usersSearchParams)

function isUserStatus(value: string): value is UserStatus {
  return (USER_STATUSES as readonly string[]).includes(value)
}

function isUserRole(value: string): value is UserRole {
  return (USER_ROLES as readonly string[]).includes(value)
}

function clampPage(page: number): number {
  return Number.isFinite(page) && page >= 1 ? Math.floor(page) : 1
}

/**
 * Menormalkan params mentah dari URL menjadi `UsersListParams`:
 * - Filter kosong → undefined (tidak dikirim ke API)
 * - Status/role yang tidak dikenal → undefined (bukan error)
 * - Page dipastikan minimal 1
 */
export function toUsersListParams(raw: UsersParamsValues): UsersListParams {
  return {
    q: raw.q,
    status: isUserStatus(raw.status) ? raw.status : undefined,
    role: isUserRole(raw.role) ? raw.role : undefined,
    sortBy: raw.sortBy,
    sortDir: raw.sortDir,
    page: clampPage(raw.page),
    perPage: raw.perPage,
  }
}
