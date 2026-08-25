# Mock Data Client-Side & Ganti ke API Nyata

Template ini berjalan **full client-side** (static export) sehingga bisa
dideploy ke Cloudflare Pages / Netlify / hosting statis apa pun.

## Cara Kerja Mock

| Bagian | Lokasi |
| --- | --- |
| Mock store in-browser (seed 23 user + CRUD) | `features/users/api/users.mock.ts` |
| Layer API fitur (satu-satunya pintu "backend") | `features/users/api/users.api.ts` |

- `users.api.ts` mengekspor fungsi yang sama seperti versi HTTP:
  `fetchUsersList`, `fetchCreateUser`, `fetchUpdateUser`, `fetchDeleteUser`.
- Isinya mendelegasikan ke `usersMockStore` dengan latensi simulasi
  (~250–500 ms) agar state loading/skeleton terlihat realistis.
- Data hidup selama tab terbuka; **refresh = reset ke seed**.
- Statistik dashboard (`features/dashboard`) ikut client-side lewat
  TanStack Query (`useDashboardStats`).

## Kontrak Data (untuk backend nyata nanti)

| Operasi | Bentuk REST | Sukses | Error |
| --- | --- | --- | --- |
| List | GET `/api/users?q&status&role&sortBy&sortDir&page&perPage` | 200 `{ items, meta }` | 400 |
| Create | POST `/api/users` body `CreateUserInput` | 201 `User` | 400, 409 email duplikat |
| Update | PATCH `/api/users/:id` body parsial | 200 `User` | 400, 404 |
| Delete | DELETE `/api/users/:id` | 200 | 404 |

Skema Zod (`schemas/user.schema.ts`) tetap jadi kontrak bersama —
saat backend ada, jalankan validasi yang sama di server.

## Ganti ke API Nyata

Ubah **hanya** `features/users/api/users.api.ts`:

```ts
import { apiFetch } from "@/lib/api-client"
import type { PaginatedResponse } from "@/types/api"

const BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}/users`

function buildListUrl(params: UsersListParams): string {
  const searchParams = new URLSearchParams()
  if (params.q) searchParams.set("q", params.q)
  if (params.status) searchParams.set("status", params.status)
  if (params.role) searchParams.set("role", params.role)
  searchParams.set("sortBy", params.sortBy)
  searchParams.set("sortDir", params.sortDir)
  searchParams.set("page", String(params.page))
  searchParams.set("perPage", String(params.perPage))
  const qs = searchParams.toString()
  return qs ? `${BASE_URL}?${qs}` : BASE_URL
}

export function fetchUsersList(params: UsersListParams) {
  return apiFetch<PaginatedResponse<User>>(buildListUrl(params))
}

export function fetchCreateUser(payload: CreateUserInput) {
  return apiFetch<User>(BASE_URL, { method: "POST", body: payload })
}

export function fetchUpdateUser(id: string, payload: UpdateUserInput) {
  return apiFetch<User>(`${BASE_URL}/${id}`, { method: "PATCH", body: payload })
}

export function fetchDeleteUser(id: string) {
  return apiFetch<void>(`${BASE_URL}/${id}`, { method: "DELETE" })
}
```

Lalu:

1. Hapus `users.mock.ts`.
2. Pastikan response error server berbentuk `{ message: string }`
   agar toast client informatif (`apiFetch` sudah menanganinya).

Tidak ada hooks, komponen, atau state yang perlu berubah —
query key, invalidasi, dan UI tetap identik.

> Catatan CORS/cookie: jika backend di domain lain, set credentials
> pada `apiFetch` atau proxy melalui rewrites saat kelak kembali
> memakai server Next.js.
