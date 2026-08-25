import type { PaginatedResponse } from "@/types/api"

import { USER_STATUSES } from "../constants/user.constants"
import type {
  CreateUserInput,
  UpdateUserInput,
  User,
  UsersListParams,
} from "../types/user.types"

/**
 * Mock database in-browser untuk mode full client-side
 * (deploy statis, mis. Cloudflare Pages).
 *
 * - Data hidup selama tab berjalan; refresh halaman = reset ke seed.
 * - Kontrak fungsi 1:1 dengan REST API (`users.api.ts`), sehingga saat
 *   backend nyata tersedia cukup tukar isi `users.api.ts`.
 */

const SEED_USERS: ReadonlyArray<
  Pick<User, "name" | "email" | "role" | "status"> & { daysAgo: number }
> = [
  { name: "Budi Santoso", email: "budi.santoso@example.com", role: "admin", status: "active", daysAgo: 1 },
  { name: "Siti Rahayu", email: "siti.rahayu@example.com", role: "editor", status: "active", daysAgo: 2 },
  { name: "Andi Wijaya", email: "andi.wijaya@example.com", role: "viewer", status: "inactive", daysAgo: 3 },
  { name: "Dewi Lestari", email: "dewi.lestari@example.com", role: "editor", status: "active", daysAgo: 4 },
  { name: "Rudi Hartono", email: "rudi.hartono@example.com", role: "admin", status: "suspended", daysAgo: 5 },
  { name: "Maya Sari", email: "maya.sari@example.com", role: "viewer", status: "active", daysAgo: 6 },
  { name: "Agus Pratama", email: "agus.pratama@example.com", role: "editor", status: "inactive", daysAgo: 7 },
  { name: "Rina Melati", email: "rina.melati@example.com", role: "viewer", status: "active", daysAgo: 8 },
  { name: "Hendra Gunawan", email: "hendra.gunawan@example.com", role: "admin", status: "active", daysAgo: 9 },
  { name: "Lina Marlina", email: "lina.marlina@example.com", role: "viewer", status: "suspended", daysAgo: 10 },
  { name: "Fajar Nugroho", email: "fajar.nugroho@example.com", role: "editor", status: "active", daysAgo: 11 },
  { name: "Putri Ayu", email: "putri.ayu@example.com", role: "viewer", status: "inactive", daysAgo: 12 },
  { name: "Bayu Setiawan", email: "bayu.setiawan@example.com", role: "admin", status: "active", daysAgo: 13 },
  { name: "Indah Permata", email: "indah.permata@example.com", role: "editor", status: "active", daysAgo: 14 },
  { name: "Doni Saputra", email: "doni.saputra@example.com", role: "viewer", status: "suspended", daysAgo: 15 },
  { name: "Wulan Cahyani", email: "wulan.cahyani@example.com", role: "editor", status: "inactive", daysAgo: 16 },
  { name: "Eko Prasetyo", email: "eko.prasetyo@example.com", role: "admin", status: "active", daysAgo: 17 },
  { name: "Nia Ramadhani", email: "nia.ramadhani@example.com", role: "viewer", status: "active", daysAgo: 18 },
  { name: "Tomi Handoko", email: "tomi.handoko@example.com", role: "editor", status: "inactive", daysAgo: 19 },
  { name: "Sri Wahyuni", email: "sri.wahyuni@example.com", role: "viewer", status: "active", daysAgo: 20 },
  { name: "Gilang Ramadan", email: "gilang.ramadan@example.com", role: "admin", status: "suspended", daysAgo: 21 },
  { name: "Ayu Kartika", email: "ayu.kartika@example.com", role: "editor", status: "active", daysAgo: 22 },
  { name: "Rizky Billar", email: "rizky.billar@example.com", role: "viewer", status: "inactive", daysAgo: 23 },
]

function createSeedUser(
  seed: (typeof SEED_USERS)[number],
  index: number,
): User {
  const createdAt = new Date(Date.now() - seed.daysAgo * 24 * 60 * 60 * 1000)

  return {
    id: `usr_${String(index + 1).padStart(3, "0")}`,
    name: seed.name,
    email: seed.email,
    role: seed.role,
    status: seed.status,
    createdAt: createdAt.toISOString(),
    updatedAt: createdAt.toISOString(),
  }
}

const users: User[] = SEED_USERS.map(createSeedUser)

/** Simulasi latensi jaringan agar state loading terlihat realistis. */
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function randomLatency(): Promise<void> {
  return delay(250 + Math.random() * 250)
}

export class MockApiError extends Error {}

function matchesQuery(user: User, query: string): boolean {
  const normalizedQuery = query.toLowerCase()

  return (
    user.name.toLowerCase().includes(normalizedQuery) ||
    user.email.toLowerCase().includes(normalizedQuery)
  )
}

function compareByField(
  a: User,
  b: User,
  field: UsersListParams["sortBy"],
): number {
  switch (field) {
    case "createdAt":
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    default:
      return a[field].localeCompare(b[field])
  }
}

export const usersMockStore = {
  async list(params: UsersListParams): Promise<PaginatedResponse<User>> {
    await randomLatency()

    const { q, status, role, sortBy, sortDir, page, perPage } = params

    let result = users

    if (q) result = result.filter((user) => matchesQuery(user, q))
    if (status) result = result.filter((user) => user.status === status)
    if (role) result = result.filter((user) => user.role === role)

    result = [...result].sort((a, b) => {
      const comparison = compareByField(a, b, sortBy)
      return sortDir === "asc" ? comparison : -comparison
    })

    const totalItems = result.length
    const totalPages = Math.max(Math.ceil(totalItems / perPage), 1)
    const safePage = Math.min(page, totalPages)
    const start = (safePage - 1) * perPage

    return {
      items: result.slice(start, start + perPage),
      meta: { page: safePage, perPage, totalItems, totalPages },
    }
  },

  counts(): Record<string, number> {
    const counts: Record<string, number> = { total: users.length }

    for (const status of USER_STATUSES) {
      counts[status] = users.filter((user) => user.status === status).length
    }

    return counts
  },

  async create(input: CreateUserInput): Promise<User> {
    await randomLatency()

    const isDuplicate = users.some(
      (user) => user.email.toLowerCase() === input.email.toLowerCase(),
    )
    if (isDuplicate) {
      throw new MockApiError(`Email "${input.email}" sudah dipakai.`)
    }

    const now = new Date().toISOString()
    const createdUser: User = {
      id: crypto.randomUUID(),
      ...input,
      createdAt: now,
      updatedAt: now,
    }

    users.unshift(createdUser)
    return createdUser
  },

  async update(id: string, input: UpdateUserInput): Promise<User> {
    await randomLatency()

    const user = users.find((candidate) => candidate.id === id)
    if (!user) throw new MockApiError("Pengguna tidak ditemukan.")

    Object.assign(user, input, { updatedAt: new Date().toISOString() })
    return user
  },

  async remove(id: string): Promise<void> {
    await randomLatency()

    const index = users.findIndex((candidate) => candidate.id === id)
    if (index === -1) throw new MockApiError("Pengguna tidak ditemukan.")

    users.splice(index, 1)
  },
}
