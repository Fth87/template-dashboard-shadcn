# Dokumentasi Template Dashboard

Template dashboard Next.js dengan CRUD lengkap dan arsitektur **feature-based**.
Semua aturan wajib proyek dirangkum di [`AGENTS.md`](../AGENTS.md).

## Daftar Isi

| Dokumen | Isi |
| --- | --- |
| [architecture.md](./architecture.md) | Struktur folder lengkap, arah dependency, aturan import |
| [conventions.md](./conventions.md) | Konvensi kode, atomic design, server vs client component |
| [features.md](./features.md) | Playbook step-by-step menambah fitur baru (checklist) |
| [url-state.md](./url-state.md) | Kontrak query params URL (nuqs) — search/filter/sort/page |
| [data-fetching.md](./data-fetching.md) | TanStack Query: query keys, options factory, mutations, invalidasi |
| [forms-validation.md](./forms-validation.md) | React Hook Form + Zod: satu schema untuk client & server |
| [data-table.md](./data-table.md) | TanStack Table v9: features opt-in, mode manual, cara pakai |
| [rich-text.md](./rich-text.md) | Tiptap v3: editor, format JSON, static-renderer |
| [mock-api.md](./mock-api.md) | Mock data client-side & cara ganti ke API sungguhan |
| [deployment.md](./deployment.md) | Deploy static export ke Cloudflare Pages |

## Stack

- **Next.js 16** (App Router, Turbopack) + **React 19**
- **TypeScript** strict
- **Tailwind CSS v4**
- **shadcn/ui** (primitif Base UI)
- **TanStack Table v9** — tabel headless feature-based
- **TanStack Query v5** — data fetching & cache
- **React Hook Form 7** + **Zod v4** — form & validasi
- **nuqs** — state URL query params yang type-safe
- **sonner** + **next-themes**

## Aturan Emas

1. **`src/app/` hanya routing.** Page file hanya memanggil komponen dari `src/features/`.
2. **Satu fitur = satu folder** di `src/features/`. Semua yang spesifik fitur hidup di dalamnya: `api/`, `hooks/`, `components/`, `schemas/`, `types/`, `constants/`.
3. **Yang dipakai lintas fitur = global**: `src/components/`, `src/hooks/`, `src/lib/`, `src/types/`, `src/config/`.
4. **State tabel hidup di URL.** Refresh/share link tidak menghilangkan search, filter, sorting, pagination.
5. **Baca docs bundled Next.js** (`node_modules/next/dist/docs/`) sebelum menyentuh kode Next.js — lihat AGENTS.md.
