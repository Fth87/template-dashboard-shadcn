# URL State (nuqs) — Kontrak Query Params

## Kenapa URL?

State tabel disimpan **100% di query params** sehingga:

- Refresh → state tidak hilang
- Copy-paste link → penerima melihat tabel yang sama persis
- Back/forward browser → navigasi antar kondisi tabel berfungsi
- Server punya akses ke params yang sama untuk SSR/prefetch

Library: [nuqs](https://nuqs.47ng.com) v2 — type-safe parser untuk `useSearchParams` di Next.js App Router.

## Kontrak Params Feature Users

| Param | Parser | Default | Arti kosong |
| --- | --- | --- | --- |
| `q` | `parseAsString` | `""` | Tidak ada pencarian |
| `status` | `parseAsString` | `""` | Semua status |
| `role` | `parseAsString` | `""` | Semua peran |
| `sortBy` | `parseAsStringLiteral(USERS_SORTABLE_FIELDS)` | `"createdAt"` | — |
| `sortDir` | `parseAsStringLiteral(SORT_DIRECTIONS)` | `"desc"` | — |
| `page` | `parseAsInteger` | `1` | — |
| `perPage` | `parseAsInteger` | `10` | — |

Contoh URL:

```
/users?q=budi&status=active&sortDir=asc&page=2&perPage=20
```

Prinsip penting:

1. **Filter kosong = param dihapus dari URL** (kirim `null` ke setter nuqs), bukan `?status=`.
2. **Perubahan filter selalu reset halaman**: setiap handler filter mengirim `page: null`.
3. **Ganti `perPage` → kembali ke page 1** (ditangani di `handlePaginationChange`).
4. Nilai aneh yang diketik manual di URL dinormalkan:
   - Client: `toUsersListParams()` memvalidasi status/role terhadap konstanta; tidak valid → `undefined`.
   - Server: `usersListQuerySchema` memakai `.catch()` agar nilai rusak jatuh ke default, bukan error 500.

## File Terkait (`features/users/hooks/use-users-params.ts`)

| Export | Fungsi |
| --- | --- |
| `usersSearchParams` | Peta parser nuqs (sumber kontrak URL) |
| `useUsersParams()` | `{ params, setParams }` — baca/tulis URL dari client |
| `loadUsersParams` | `createLoader(...)` untuk Server Component (opsional) |
| `toUsersListParams(raw)` | Normalisasi nilai URL → `UsersListParams` siap fetch |

## Cara Kerja Sinkronisasi Tabel

`use-users-table.ts` menjembatani dua dunia:

- **Baca**: `params.page/perPage` → `state.pagination`; `params.sortBy/sortDir` → `state.sorting`.
- **Tulis**: `onPaginationChange` / `onSortingChange` (dipicu komponen generik seperti `DataTablePagination`) → dipetakan balik → `setParams(...)`.
- Mode **manual** (`manualPagination`, `manualSorting`, `rowCount`) aktif karena filtering/sorting/pagination dikerjakan server.

## Menambah Param Baru

1. Tambahkan entri parser di `usersSearchParams`.
2. Tambahkan field di `usersListQuerySchema` (server).
3. Tambahkan di `toUsersListParams` bila butuh normalisasi.
4. Tambahkan kontrol UI di toolbar; ingat `page: null` saat nilainya berubah.
5. Reset button: tambahkan param ke daftar `null` pada handler Reset.
