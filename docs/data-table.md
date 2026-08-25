# Data Table — TanStack Table v9

## Yang Baru di v9 (penting!)

v9 berubah besar dari v8. Jangan memakai ingatan pola v8:

| v8 | v9 |
| --- | --- |
| `useReactTable({ getCoreRowModel, getSortedRowModel, ... })` | `useTable({ features, ... })` — row model didaftarkan di objek **features** |
| Semua fitur ter-bundle | **Opt-in**: hanya fitur yang didaftar di `tableFeatures()` yang ikut bundle |
| `flexRender(cell.column.columnDef.cell, ctx)` | `<table.FlexRender cell={cell} />` (properti instance) |
| `table.getState()` | `table.state` |
| — | `row.getVisibleCells()` butuh `columnVisibilityFeature` didaftarkan |

Referensi resmi: panduan Data Table shadcn/ui + `node_modules/@tanstack/table-core/dist/features/*`.

## Registrasi Features Global (`components/data-table/data-table-features.ts`)

```ts
export const dataTableFeatures = tableFeatures({
  rowSortingFeature,
  rowPaginationFeature,
  columnVisibilityFeature, // wajib untuk row.getVisibleCells()
  sortFns: { alphanumeric: sortFn_alphanumeric, text: sortFn_text },
})

export type DataTableFeatures = typeof dataTableFeatures
```

Semua tabel aplikasi memakai objek ini agar tipe konsisten dan bundle tetap kecil.

## Mode Manual (Server-Side)

Karena filtering/sorting/pagination dikerjakan server (query params), tabel dikonfigurasi:

```ts
useTable({
  features: dataTableFeatures,
  data, columns,
  state: { pagination, sorting },
  onPaginationChange, onSortingChange,
  manualPagination: true,
  manualSorting: true,
  rowCount: totalItemsDariServer, // → getPageCount() dihitung dari sini
})
```

Konsekuensi: TIDAK ada `filteredRowModel`/`sortedRowModel` yang didaftarkan (tidak dipakai).

## Komponen Generik (`components/data-table/`)

| File | Peran |
| --- | --- |
| `data-table.tsx` | Renderer murni: slot `children` (toolbar), tabel, skeleton saat loading, empty state, slot `footer` (pagination) |
| `data-table-pagination.tsx` | Kontrol halaman; memanggil `table.setPageIndex/...` → lewat callback diarahkan ke URL oleh hook feature |
| `data-table-column-header.tsx` | Header sortable dengan dropdown Naik/Turun/Hapus urutan |
| `data-table-view-options.tsx` | Toggle visibilitas kolom (pola resmi "Reusable Components") |
| `data-table-types.ts` | `DataTableInstance<TData>` = alias `ReactTable<DataTableFeatures, TData>` |

Komponen ini **tidak tahu domain apa pun** — bisa dipakai feature lain apa pun.

## Checklist Kesesuaian Best Practice

| Aspek | Sumber best practice | Status |
| --- | --- | --- |
| Manual pagination + `rowCount` + updater pattern | TanStack Table guide: Pagination | ✅ |
| `placeholderData: keepPreviousData` untuk ganti halaman | TanStack Query | ✅ |
| Skeleton rows saat fetch pertama, dim saat refetch | Demo resmi Tasks shadcn | ✅ |
| Empty state "Tidak ada data" | Demo resmi Tasks | ✅ |
| Header sort dropdown (asc/desc/clear) | `DataTableColumnHeader` resmi | ✅ |
| Pagination 4 tombol + page-size select + info baris | `DataTablePagination` resmi | ✅ |
| Search input di toolbar terikat state tabel | Tasks demo | ✅ (terikat URL, bukan state lokal) |
| Filter dropdown + tombol Reset kondisional | Tasks demo | ✅ |
| View options (toggle kolom) | `DataTableViewOptions` resmi | ✅ |
| Self-healing URL saat server clamp halaman | Konsekuensi manual pagination | ✅ (effect di `use-users-table`) |

**Keputusan sadar (dokumentasi, bukan kelalaian):**

1. **Filter "server-side" via URL** — penyedia data (saat ini mock in-browser; nanti REST API) yang mengerjakan filter/sort/pagination. Bukan column filter client-side milik TanStack. URL membuat state shareable. Mode manual + `rowCount` adalah pola yang direkomendasikan TanStack untuk kasus ini.
2. **Filter status/role single-select** (Select), bukan faceted multi-select checkbox seperti demo Tasks. Demo Tasks menghitung facet dari dataset penuh di client — tidak berlaku untuk dataset yang dipaginasi penyedia data.
3. **Visibilitas kolom = state lokal**, tidak masuk URL — sama seperti demo resmi; tidak memengaruhi query data.
4. **Sorting kolom tunggal** — sesuai kemampuan endpoint (`sortBy`+`sortDir`). Multi-sort bisa ditambah bila server mendukung.

## Self-Healing Halaman

Server meng-clamp `page` ke `totalPages` (mis. filter menyusutkan hasil dari 5 halaman → 2). Agar UI tidak menampilkan "Halaman 5" padahal data halaman 1:

```ts
React.useEffect(() => {
  const meta = usersQuery.data?.meta
  if (!meta || usersQuery.isPlaceholderData) return
  if (meta.page !== listParams.page) void setParams({ page: meta.page })
}, [...])
```

URL ikut diperbaiki sehingga refresh/share tetap konsisten.

## Menambah Kolom (feature users)

Edit `features/users/components/users-table-columns.tsx`:

```tsx
const columnHelper = createColumnHelper<DataTableFeatures, User>()

columnHelper.accessor("email", {
  header: ({ column }) => <DataTableColumnHeader column={column} title="Email" />,
  cell: ({ row }) => <span>{row.original.email}</span>,
})
```

- Kolom tanpa accessor (aksi): `columnHelper.display({ id: "actions", ... })`.
- Agar kolom sortable di server: tambahkan field-nya ke `USERS_SORTABLE_FIELDS` (constants) — schema server otomatis mengikutinya.

## Menambah Fitur Tabel Klien Lain (mis. row selection)

1. Daftarkan feature di `data-table-features.ts`: `rowSelectionFeature`.
2. Tambahkan state + handler di `use-users-table.ts`, simpan ke URL bila perlu persisten.
3. Tambahkan kolom checkbox via `columnHelper.display(...)`.
