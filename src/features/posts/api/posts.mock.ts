import type { PaginatedResponse } from "@/types/api"

import type {
  CreatePostInput,
  Post,
  PostsListParams,
  UpdatePostInput,
} from "../types/post.types"

/**
 * Mock store in-browser untuk fitur posts (mode static export).
 * Kontrak fungsi 1:1 dengan REST API — pola sama dengan `users.mock.ts`.
 */

/** Helper: bikin konten JSON Tiptap sederhana untuk seed. */
function doc(...paragraphs: string[]): string {
  return JSON.stringify({
    type: "doc",
    content: paragraphs.map((text) => ({
      type: "paragraph",
      content: [{ type: "text", text }],
    })),
  })
}

const SEED_POSTS: ReadonlyArray<
  Pick<Post, "title" | "status" | "content"> & { daysAgo: number }
> = [
  { title: "Panduan Memulai Dashboard", status: "published", daysAgo: 1, content: doc("Selamat datang di template dashboard. Artikel ini menjelaskan cara memakai tabel, filter, dan CRUD.", "Semua state tabel tersimpan di URL sehingga tidak hilang saat halaman di-refresh.") },
  { title: "Catatan Rilis v1.0", status: "published", daysAgo: 3, content: doc("Rilis pertama mencakup manajemen pengguna dan artikel.", "Termasuk dark mode serta dukungan static export.") },
  { title: "Checklist Migrasi Backend", status: "draft", daysAgo: 4, content: doc("Draf: daftar langkah mengganti mock store dengan REST API nyata.") },
  { title: "Tips Menyusun Filter Tabel", status: "published", daysAgo: 6, content: doc("Filter yang baik selalu mereset nomor halaman ke awal.", "Nilai kosong sebaiknya dihapus dari URL agar tautan tetap bersih.") },
  { title: "Rencana Fitur Kolaborasi", status: "draft", daysAgo: 8, content: doc("Draf awal: eksplorasi editing kolaboratif berbasis CRDT.") },
  { title: "Ringkasan Survey Pengguna Q2", status: "published", daysAgo: 11, content: doc("Sebanyak 72% responden meminta pencarian yang lebih cepat.", "Fitur paling diminta berikutnya adalah ekspor data ke spreadsheet.") },
  { title: "Panduan Gaya Penulisan Konten", status: "published", daysAgo: 14, content: doc("Gunakan kalimat aktif dan hindari jargon teknis.", "Satu paragraf idealnya terdiri atas dua sampai empat kalimat.") },
  { title: "Ide Integrasi Notifikasi", status: "draft", daysAgo: 17, content: doc("Draf: notifikasi email vs in-app — belum diputuskan.") },
  { title: "Retrospektif Sprint 12", status: "published", daysAgo: 21, content: doc("Velocity tim naik 15% dibanding sprint sebelumnya.", "Bottleneck utama ada pada review PR yang menumpuk di akhir sprint.") },
]

const posts: Post[] = SEED_POSTS.map((seed, index) => {
  const createdAt = new Date(Date.now() - seed.daysAgo * 24 * 60 * 60 * 1000)

  return {
    id: `pst_${String(index + 1).padStart(3, "0")}`,
    title: seed.title,
    status: seed.status,
    content: seed.content,
    createdAt: createdAt.toISOString(),
    updatedAt: createdAt.toISOString(),
  }
})

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function randomLatency(): Promise<void> {
  return delay(250 + Math.random() * 250)
}

export class MockApiError extends Error {}

function compareByField(
  a: Post,
  b: Post,
  field: PostsListParams["sortBy"],
): number {
  switch (field) {
    case "createdAt":
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    default:
      return a[field].localeCompare(b[field])
  }
}

export const postsMockStore = {
  async getById(id: string): Promise<Post> {
    await randomLatency()

    const post = posts.find((candidate) => candidate.id === id)
    if (!post) throw new MockApiError("Artikel tidak ditemukan.")

    // Kembalikan salinan agar state internal tidak bisa dimutasi pemanggil.
    return { ...post }
  },

  async list(params: PostsListParams): Promise<PaginatedResponse<Post>> {
    await randomLatency()

    const { q, status, sortBy, sortDir, page, perPage } = params

    let result = posts

    if (q) {
      const normalizedQuery = q.toLowerCase()
      result = result.filter((post) =>
        post.title.toLowerCase().includes(normalizedQuery),
      )
    }
    if (status) result = result.filter((post) => post.status === status)

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

  async create(input: CreatePostInput): Promise<Post> {
    await randomLatency()

    const now = new Date().toISOString()
    const createdPost: Post = {
      id: crypto.randomUUID(),
      ...input,
      createdAt: now,
      updatedAt: now,
    }

    posts.unshift(createdPost)
    return createdPost
  },

  async update(id: string, input: UpdatePostInput): Promise<Post> {
    await randomLatency()

    const post = posts.find((candidate) => candidate.id === id)
    if (!post) throw new MockApiError("Artikel tidak ditemukan.")

    Object.assign(post, input, { updatedAt: new Date().toISOString() })
    return post
  },

  async remove(id: string): Promise<void> {
    await randomLatency()

    const index = posts.findIndex((candidate) => candidate.id === id)
    if (index === -1) throw new MockApiError("Artikel tidak ditemukan.")

    posts.splice(index, 1)
  },
}
