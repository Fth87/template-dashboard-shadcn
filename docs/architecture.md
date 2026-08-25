# Arsitektur

## Prinsip

1. **Feature-based** — kode dikelompokkan per fitur bisnis, bukan per tipe file.
2. **Separation of concerns** — API, state, tampilan, validasi, dan tipe dipisah ke file/folder masing-masing.
3. **App layer tipis** — `src/app/` hanya berisi routing, providers, dan halaman. Tidak ada logika UI.
4. **Full client-side** — build memakai `output: "export"` (statis, siap Cloudflare Pages). Data diambil di browser lewat TanStack Query; tidak ada API routes / kode server khusus.

## Peta Folder

```
src/
├── app/                          # ROUTING SAJA
│   ├── layout.tsx                # Root layout: font, metadata, Providers
│   ├── providers.tsx             # NuqsAdapter + QueryClientProvider + ThemeProvider + TooltipProvider + Toaster
│   ├── page.tsx                  # Redirect → /dashboard
│   ├── not-found.tsx             # Halaman 404 global
│   ├── globals.css               # Token preset shadcn (base color: neutral)
│   └── (dashboard)/              # Route group: shell sidebar+header
│       ├── layout.tsx            # SidebarProvider → Sidebar (inset) + SidebarInset
│       ├── dashboard/page.tsx    # Metadata + <DashboardPage />
│       ├── users/page.tsx        # Metadata + Suspense + <UsersPage />
│       ├── posts/page.tsx        # Metadata + Suspense + <PostsPage />
│       ├── posts/new/page.tsx    # Halaman create artikel (full page)
│       └── posts/edit/page.tsx   # Halaman edit via ?id= (Suspense)
│
├── features/                     # FITUR BISNIS
│   ├── users/
│   │   ├── api/                  # Layer data
│   │   │   ├── users.api.ts      # Kontrak data (fetch/mock) — SATU tempat ganti backend
│   │   │   ├── users.mock.ts     # Mock store in-browser (mode static export)
│   │   │   └── users.queries.ts  # Query keys + queryOptions factory
│   │   ├── components/           # Komponen khusus fitur ini
│   │   │   ├── users-page.tsx            # Entry point fitur
│   │   │   ├── users-data-table.tsx      # Rangkai toolbar+tabel+pagination+view options
│   │   │   ├── users-table-toolbar.tsx   # Search + filter + reset
│   │   │   ├── users-table-columns.tsx   # Definisi kolom TanStack Table
│   │   │   ├── users-table-row-actions.tsx
│   │   │   ├── user-form-dialog.tsx      # Dialog create/edit
│   │   │   └── user-delete-dialog.tsx
│   │   ├── hooks/                # Hook khusus fitur
│   │   │   ├── use-users-params.ts   # State URL (nuqs) + normalisasi
│   │   │   ├── use-users-query.ts    # useQuery wrapper
│   │   │   ├── use-create-user.ts    # Mutation create
│   │   │   ├── use-update-user.ts    # Mutation update
│   │   │   ├── use-delete-user.ts    # Mutation delete
│   │   │   ├── use-users-table.ts    # Sinkronisasi URL ↔ tabel ↔ query
│   │   │   └── use-user-form.ts      # Logika form (RHF)
│   │   ├── schemas/user.schema.ts    # Skema Zod (kontrak validasi bersama)
│   │   ├── types/user.types.ts       # Tipe TS (infer dari skema/konstanta)
│   │   ├── constants/user.constants.ts # Sumber kebenaran nilai domain
│   │   └── index.ts              # PUBLIC API fitur (satu-satunya pintu masuk)
│   ├── dashboard/
│   │   ├── components/dashboard-page.tsx    # Stat cards + charts (client-side)
│   │   │   └── users-growth-chart.tsx · user-status-chart.tsx
│   │   ├── hooks/use-dashboard-stats.ts     # Stats via TanStack Query
│   │   ├── constants/dashboard.constants.ts # Data dummy + chart config
│   │   └── index.ts
│   └── posts/
│       ├── api/                     # posts.api.ts · posts.mock.ts · posts.queries.ts
│       ├── components/              # posts-page, data-table, toolbar, columns,
│       │                            # row-actions, post-form (HALAMAN create/edit),
│       │                            # edit-post-page (?id=), post-view-dialog,
│       │                            # delete-dialog
│       ├── hooks/                   # use-posts-{params,query,detail}, mutations,
│       │                            # use-posts-table, use-post-form
│       ├── schemas/post.schema.ts   # content = string JSON Tiptap tervalidasi
│       ├── types/ · constants/ · index.ts
│
├── components/                      # GLOBAL (dipakai lintas fitur)
│   ├── ui/                          # ATOM: primitif shadcn/ui (generated)
│   ├── rich-text-editor/            # ORGANISM: Tiptap v3 (editor + view)
│   │   ├── editor-extensions.ts     # Ekstensi tunggal editor+renderer
│   │   ├── rich-text-editor.tsx     # Editor terkontrol + toolbar
│   │   ├── rich-text-view.tsx       # JSON → HTML (.prose)
│   │   └── index.ts
│   ├── data-table/                  # ORGANISM: modul tabel generik
│   │   ├── data-table-features.ts   # Registrasi fitur TanStack Table v9
│   │   ├── data-table-types.ts      # Alias tipe DataTableInstance<T>
│   │   ├── data-table.tsx           # Renderer tabel (slot toolbar & footer)
│   │   ├── data-table-column-header.tsx
│   │   ├── data-table-pagination.tsx
│   │   ├── data-table-view-options.tsx   # Toggle kolom
│   │   ├── pagination-config.ts     # PAGE_SIZE_OPTIONS global
│   │   └── index.ts
│   ├── layout/                   # Shell resmi shadcn Sidebar: app-sidebar, app-header
│   ├── page-header.tsx           # Molecule: judul halaman + slot aksi
│   ├── search-input.tsx          # Molecule: input pencarian presentasional
│   ├── confirm-dialog.tsx        # Molecule: dialog konfirmasi generik
│   ├── theme-provider.tsx
│   └── theme-toggle.tsx
│
├── hooks/                        # Hook GLOBAL lintas fitur
│   └── use-mobile.ts             # (bawaan komponen Sidebar shadcn)
│
├── lib/                          # Utilitas murni (tanpa React state)
│   ├── api-client.ts             # apiFetch + ApiError — siap pakai saat ganti API nyata
│   ├── zod-resolver.ts           # Resolver RHF ← Zod (tanpa dep eksternal)
│   ├── format.ts                 # Formatter tanggal/angka
│   ├── query-client.ts           # makeQueryClient (pola SPA)
│   └── utils.ts                  # cn() (clsx + tailwind-merge)
│
├── config/                       # Konfigurasi statis
│   ├── site.ts                   # Nama/deskripsi situs
│   └── navigation.ts             # Item navigasi sidebar
│
└── types/                        # Tipe GLOBAL
    └── api.ts                    # PaginatedResponse, PaginationMeta

docs/                             # Dokumentasi proyek
```

## Aturan Dependency (WAJIB)

Arah import yang diizinkan:

```
app/ ──→ features/ ──→ components/ · lib/ · config/ · types/
components/, lib/, config/, types/ TIDAK BOLEH mengimpor dari features/
feature A ──X──> feature B (hanya boleh lewat barrel index.ts B)
```

Detail:

| Aturan | Alasan |
| --- | --- |
| `features/*` hanya boleh diimpor dari luar lewat `features/*/index.ts` | Encapsulation; refactor internal bebas |
| Di dalam feature sendiri, import antar-file relatif (`../api/...`) | Eksplisit & mudah digeser |
| Komponen di `components/data-table/` tidak boleh tahu detail domain | Generik & reusable |
| Satu arah: `hooks → api → lib`; UI tidak pernah memanggil fungsi data langsung | Single responsibility |
| Tidak ada folder `server/` maupun route handler | Static export; semua data client-side |

## Aliran Data (users)

```
URL (?q=..&status=..&page=..)                ← sumber kebenaran state tabel
   ⇅ nuqs (use-users-params)
useUsersTable ──toUsersListParams──► useUsersQuery ──► users.queries (queryKey+fn)
   │                                                       │
   ▼                                                       ▼
TanStack Table instance                           users.api (layer data)
   │                                                       ▼
DataTable (render) ◄──────────────────────  users.mock (in-browser store)
```

Mutasi (create/update/delete): komponen → hook mutation → `users.api` → mock store → sukses → `invalidateQueries(usersKeys.lists())` → list otomatis refetch.

Saat beralih ke backend nyata, hanya isi `users.api.ts` yang berubah (jadi panggilan HTTP) — diagram di atas tetap identik.

## Build & Deploy

- `pnpm build` menghasilkan folder **`out/`** (static export).
- Panduan deploy: [`deployment.md`](./deployment.md) (Cloudflare Pages).
