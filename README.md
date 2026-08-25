# Template Dashboard

Template dashboard **Next.js 16 full client-side** (static export — siap deploy ke Cloudflare Pages) dengan CRUD lengkap, tabel best practice, dan arsitektur **feature-based** yang rapi.

## Fitur

- **Deploy statis** — `pnpm build` menghasilkan folder `out/`; tanpa server. Panduan: [`docs/deployment.md`](./docs/deployment.md).
- **Tabel lengkap dengan state di URL** — search, filter status & peran, sorting kolom, toggle kolom, pagination + page size. Refresh/share link tidak menghilangkan state.
- **CRUD penuh** — tambah/edit via dialog form tervalidasi (RHF + Zod), hapus via dialog konfirmasi, toast feedback, cache auto-refresh.
- **Rich text editor** — [Tiptap](https://tiptap.dev) v3 dengan toolbar lengkap; konten disimpan JSON & dirender ulang via static-renderer (`docs/rich-text.md`).
- **Mock data in-browser** — latensi simulasi agar loading realistis; ganti ke backend nyata hanya dengan mengubah satu file (`docs/mock-api.md`).
- **Arsitektur feature-based** — `app/` hanya routing; semua logika hidup di `features/`.
- **Separation of concerns ketat** — layer `api/`, `hooks/`, `schemas/`, `types/`, `constants/`, `components/` terpisah per fitur.
- **Atomic design + komponen shadcn resmi** — Sidebar/Data Table/Field pakai komponen bawaan shadcn/ui (Base UI), bukan tulisan ulang.
- **Dark mode**, responsif.

## Stack

Next.js 16 (App Router · Turbopack · static export) · React 19 · TypeScript strict · Tailwind CSS v4 (+ typography plugin) · shadcn/ui (Base UI) · TanStack Table v9 · TanStack Query v5 · React Hook Form 7 + Zod 4 · Tiptap v3 · nuqs · sonner

## Mulai

```bash
pnpm install
pnpm dev        # http://localhost:3000
```

Perintah lain:

```bash
pnpm build              # build produksi → folder out/
pnpm start              # tidak dipakai di mode export (lihat docs/deployment.md)
pnpm lint               # eslint
pnpm exec tsc --noEmit  # typecheck
```

## Struktur Singkat

```
src/
├── app/                 # routing saja (+ providers)
├── features/
│   ├── users/           # api/ hooks/ components/ schemas/ types/ constants/
│   ├── posts/           # CRUD artikel dengan Tiptap rich text editor
│   └── dashboard/       # stat cards + charts client-side
├── components/          # ui/ (atom) · data-table/ · rich-text-editor/ · layout/
├── lib/                 # api-client, zod-resolver, query-client, utils
├── hooks/               # hook global (use-mobile dari Sidebar shadcn)
└── config/, types/
docs/                    # dokumentasi arsitektur & playbook
```

## Deploy (Cloudflare Pages)

1. Build command: `pnpm build`
2. Output directory: `out`

Detail & alternatif Wrangler CLI: [`docs/deployment.md`](./docs/deployment.md).

## Dokumentasi

Lihat [`docs/`](./docs/README.md):

| Dokumen | Isi |
| --- | --- |
| [architecture](./docs/architecture.md) | Peta folder & aturan dependency |
| [conventions](./docs/conventions.md) | Konvensi kode & atomic design |
| [features](./docs/features.md) | Playbook menambah fitur baru |
| [url-state](./docs/url-state.md) | Kontrak query params tabel |
| [data-fetching](./docs/data-fetching.md) | TanStack Query patterns |
| [forms-validation](./docs/forms-validation.md) | RHF + Zod satu skema |
| [data-table](./docs/data-table.md) | Catatan TanStack Table v9 |
| [mock-api](./docs/mock-api.md) | Mock data client-side & ganti ke API nyata |
| [deployment](./docs/deployment.md) | Deploy static export ke Cloudflare Pages |

> Untuk agent/AI: baca [`AGENTS.md`](./AGENTS.md) sebelum menulis kode.
