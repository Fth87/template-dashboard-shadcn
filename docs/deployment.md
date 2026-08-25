# Deployment — Cloudflare Pages (Static Export)

Template ini di-build sebagai **static export** (`next.config.ts` →
`output: "export"`): seluruh halaman dirender statis, data diambil
client-side. Hasil build adalah folder `out/`.

## Build Lokal

```bash
pnpm install
pnpm build      # menghasilkan folder out/
```

Struktur penting `out/`:

```
out/
├── index.html        # redirect ke /dashboard
├── dashboard.html    # /dashboard
├── users.html        # /users
└── 404.html          # halaman not-found
```

Cloudflare Pages otomatis memetakan URL rapi: `/users` → `users.html`.

## Deploy ke Cloudflare Pages

Via dashboard:

1. **Workers & Pages → Create → Pages → Connect to Git**, pilih repo.
2. Konfigurasi build:
   - **Framework preset**: `Next.js (Static HTML Export)` (atau None)
   - **Build command**: `pnpm build`
     (jika pnpm belum tersedia, isi **Environment variable**
     `PNPM_VERSION` / aktifkan Node 20+; atau pakai
     Build command: `corepack enable && pnpm install && pnpm build`)
   - **Build output directory**: `out`
3. Deploy.

Via Wrangler CLI:

```bash
pnpm dlx wrangler pages deploy out --project-name=template-dashboard
```

## Catatan Penting

- **Tidak ada API routes** — semua data client-side (`docs/mock-api.md`).
  Saat backend nyata siap, cukup tukar isi `features/users/api/users.api.ts`.
- **`next/image` non-optimal** — config memakai `images.unoptimized: true`
  karena optimizer gambar butuh server.
- **Root redirect** `/` → `/dashboard` dieksekusi di client (payload RSC).
  Bila ingin redirect tanpa JS, ganti isi `src/app/page.tsx` menjadi halaman
  link biasa atau tambahkan aturan redirect di host (Cloudflare:
  _Redirect Rules_ `/` → `/dashboard`).
- **Environment variable** untuk API nanti: gunakan prefix
  `NEXT_PUBLIC_*` (ter-bundle saat build).
