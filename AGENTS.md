<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Aturan Wajib Proyek Ini (WAJIB dipatuhi)

## 1. WAJIB baca dokumentasi Next.js yang di-bundle SEBELUM menulis kode

**Tidak ada pengecualian.** Sebelum membuat atau mengubah file apa pun yang menyentuh Next.js (routing, layout, page, route handler, metadata, config), agent **wajib** membaca dokumen relevan dari versi yang ter-install:

```
node_modules/next/dist/docs/
├── 01-app/01-getting-started/     # konsep dasar
├── 01-app/02-guides/              # panduan mendalam
├── 01-app/03-api-reference/       # referensi API & file conventions
└── 02-pages/, 03-architecture/    # hanya jika relevan
```

Cara memenuhi aturan ini:

1. Identifikasi area yang akan disentuh (contoh: route handler → `01-app/03-api-reference/03-file-conventions/route.md`, page/layout → `page.md` / `layout.md`, struktur folder → `02-project-structure.md`).
2. Baca file tersebut (`Read`/`grep`) — jangan mengandalkan ingatan training data.
3. Patuhi deprecation notice dan breaking change yang tertulis di sana.
4. Jika perilaku berbeda dengan pengetahuan lama, **dokumen bundled yang menang**.

Alasan: Next.js berkembang cepat; docs bundled selalu 1:1 dengan versi yang ter-install, sedangkan training data bisa basi.

Peta cepat (task → file yang wajib dibaca):

| Task | File docs |
| --- | --- |
| Membuat/mengubah `app/**/page.tsx` | `01-app/03-api-reference/03-file-conventions/page.md` |
| Membuat/mengubah layout | `.../file-conventions/layout.md`, `route-groups.md` |
| Membuat/mengubah route handler (`app/api/**`) | `.../file-conventions/route.md` |
| Server vs client component | `01-app/01-getting-started/05-server-and-client-components.md` |
| Fetching/caching/revalidating | `06-fetching-data.md`, `08-caching.md`, `09-revalidating.md` |
| Metadata | `14-metadata-and-og-images.md` |
| Upgrade versi | `01-app/02-guides/upgrading/version-16.md` |

## 2. Dokumentasi proyek

Semua aturan arsitektur, konvensi, dan playbook fitur ada di [`docs/`](./docs). Baca minimal:

- `docs/architecture.md` — struktur folder & aturan dependency
- `docs/conventions.md` — konvensi kode & atomic design
- `docs/features.md` — checklist saat menambah fitur baru

## 3. Package manager

Gunakan **PNPM** untuk semua operasi package (install, add, dlx, run).

## 4. WAJIB cek shadcn/ui SEBELUM membuat komponen apa pun

**Tidak ada pengecualian.** Sebelum menulis/membuat komponen UI:

1. **Cek dulu apakah komponennya sudah ada di shadcn/ui** — daftar lengkap di `ui.shadcn.com/docs/components` (varian yang ter-install: **Base UI**, lihat `components.json` → `style`). Termasuk pola gabungan seperti Sidebar, Data Table, Form/Field.
2. **Jika ADA**: install via `pnpm dlx shadcn@latest add <nama>`, lalu **baca halaman dokumentasinya sampai selesai** (section Usage, Composition, Styling, "As Link", dsb.) dan ikuti best practice-nya. Contoh best practice yang wajib dipatuhi:
   - Link ber-tampilan tombol → `<Link className={buttonVariants()}>`, BUKAN `<Button render={<Link/>}>` (Base UI memaksa `role="button"` yang merusak semantik link).
   - Layout aplikasi → komposisi resmi `SidebarProvider → Sidebar → SidebarInset → SidebarTrigger`.
3. **Jika TIDAK ADA** di shadcn: baru buat sendiri di `src/components/`, gunakan hanya token desain resmi (`--primary`, `--muted`, dst.) — dilarang mengarang warna di luar preset.

Alasan: komponen bawaan sudah accessibility-tested dan konsisten dengan preset; menulis ulang = duplikasi + deviasi visual.
