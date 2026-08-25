# Konvensi Kode

## Bahasa & Gaya

- Identifier (variabel, fungsi, komponen): **Inggris**. Copy UI & komentar: **Indonesia**.
- TypeScript strict. Dilarang `any`; gunakan `unknown` + narrowing.
- Satu komponen/hook utama per file; nama file = nama export.
- Tanpa komentar yang menjelaskan "apa" — hanya "kenapa"/kontrak.

## Penamaan

| Artefak | Pola | Contoh |
| --- | --- | --- |
| Komponen / tipe | `PascalCase` | `UsersDataTable` |
| Hook | `useXxx.ts`, fungsi `camelCase` | `use-users-table.ts` → `useUsersTable()` |
| Util non-komponen | `kebab-case.ts` | `api-client.ts` |
| Fungsi fetch di layer api | `fetchXxx` | `fetchUsersList()` |
| Query options factory | objek `xxxQueries` | `usersQueries.list(params)` |
| Query keys | objek `xxxKeys` | `usersKeys.list(params)` |
| Konstanta | `SCREAMING_SNAKE` | `USER_STATUS_OPTIONS` |
| Skema Zod | `xxxSchema` | `createUserSchema` |

## Atomic Design

| Level | Lokasi | Ciri |
| --- | --- | --- |
| **Atom** | `components/ui/` | Primitif shadcn (Button, Input, Dialog…). Tidak tahu domain aplikasi. |
| **Molecule** | `components/*.tsx` (page-header, search-input, confirm-dialog) | Gabungan beberapa atom, masih generik. |
| **Organism** | `components/data-table/` dan `features/*/components/` | Gabungan molecule+data; punya perilaku. Global jika reusable lintas fitur (`data-table`), feature-local jika spesifik. |
| **Template/Page** | `features/*/components/*-page.tsx` + `app/**/page.tsx` | Menyusun layout halaman; page file di app hanya memanggilnya. |

## Aturan Wajib: Cek shadcn/ui Dulu

Sebelum membuat komponen apa pun:

1. **Cek daftar komponen shadcn/ui** (varian Base UI — sesuai `components.json`). Jika ada → `pnpm dlx shadcn@latest add <nama>` lalu **ikuti best practice di halaman docs-nya**.
2. Contoh best practice yang sudah diterapkan proyek ini:
   - **Link ber-tampilan button**: `<Link className={buttonVariants()}>` — BUKAN `<Button render={<Link/>}>` (Base UI memaksa `role="button"` yang merusak semantik link; lihat docs Button → "As Link").
   - **Shell layout**: komposisi resmi `SidebarProvider → Sidebar (variant inset) → SidebarInset → SidebarTrigger`; nav via `SidebarMenuButton isActive tooltip`.
   - **Tooltip global**: `TooltipProvider` dipasang di `app/providers.tsx` karena Sidebar memakai tooltip saat collapsed.
3. Komponen custom hanya untuk yang **tidak tersedia** di shadcn (`page-header`, `search-input`, `confirm-dialog`, modul `data-table`).
4. Dilarang mengarang warna: gunakan token preset (`--primary`, `--muted-foreground`, dsb.). Nilai token berasal dari preset resmi (lihat `globals.css`, base color `neutral`).

## Server vs Client Component

Template ini **full client-side** (static export untuk Cloudflare Pages):

- Semua halaman di-prerender jadi HTML statis saat build, lalu **hidrasi penuh** — data selalu diambil di browser via TanStack Query.
- Tidak ada API routes / kode server runtime. Satu-satunya "backend" adalah mock store in-browser (`features/users/api/users.mock.ts`) yang diakses lewat layer API fitur.
- File tetap ditandai `"use client"` bila memakai state/effect/browser API (semua komponen interaktif).
- File tanpa directive (`layout.tsx`, `page.tsx`, komponen presentasional seperti `page-header`) boleh dirender statis.
- Providers dikumpulkan di satu file client (`app/providers.tsx`) agar layout tetap server.

> Saat kelak kembali ke SSR (mis. pindah ke VPS/Vercel), arsitektur tidak berubah — cukup hapus `output: "export"` dan ganti isi layer API fitur.

## Error Handling

- Layer API melempar error ber-`message` (`MockApiError` sekarang, `ApiError` saat HTTP). Hook mutation menampilkan toast; komponen cukup try/catch tanpa toast ganda.
- Validasi input tetap satu skema Zod: dipakai form client; saat backend nyata ada, skema yang sama dipakai ulang untuk validasi sisi server (lihat `docs/forms-validation.md`).

## Format & Tooling

- Formatter mengikuti style bawaan create-next-app; linter: `pnpm lint`.
- Typecheck manual: `pnpm exec tsc --noEmit`. Build: `pnpm build`.

## Aturan Anti-Redundansi

1. **Single source of truth** — nilai domain (`active|inactive|suspended`) didefinisikan SEKALI di `constants/`; skema Zod, tipe TS, opsi filter UI, dan mock semuanya menurunkan dari situ.
2. Validasi ditulis sekali di `schemas/` — dipakai form client (dan siap dipakai server saat backend ada).
3. Dilarang menulis helper duplikat; kalau util dipakai ≥2 fitur → naikkan ke `lib/`.
4. Dilarang "defensive code" kosong (state/prop yang tidak pernah dibaca).

## Git

- Commit kecil dan fokus per concern (feat/fix/refactor/docs).
- Jangan commit `.next/`, `out/`, `node_modules/` (sudah ada di `.gitignore`).
