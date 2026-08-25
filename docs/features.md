# Playbook: Menambah Fitur Baru

Contoh kasus: menambah fitur **`products`**. Ikuti urutan ini (setiap langkah = file/folder baru di `src/features/products/`).

## 1. Konstanta Domain — `constants/product.constants.ts`

Definisikan nilai-nilai enum domain + opsi label UI + default sort:

```ts
export const PRODUCT_CATEGORIES = ["digital", "physical"] as const
export const PRODUCT_CATEGORY_OPTIONS = [
  { value: "digital", label: "Digital" },
] satisfies ReadonlyArray<{ value: ProductCategory; label: string }>
// type ProductCategory = ... (letakkan di types/, lihat langkah 3)
export const PRODUCTS_SORTABLE_FIELDS = ["name", "price", "createdAt"] as const
export const SORT_DIRECTIONS = ["asc", "desc"] as const // ← sudah ada global? gunakan dari users dulu; idealnya pindah ke src/lib bila ≥2 fitur memakai
```

> Jika konstanta mulai dipakai >1 fitur (mis. `SORT_DIRECTIONS`, `PaginatedResponse`), pindahkan ke `lib/` atau `types/` global.

## 2. Skema Zod — `schemas/product.schema.ts`

- `createProductSchema` (validasi form & body POST)
- `updateProductSchema` (= create.partial())
- `productsListQuerySchema` (kontrak query params GET list)

## 3. Tipe — `types/product.types.ts`

Turunkan dari skema & konstanta, jangan tulis manual:

```ts
export type ProductCategory = (typeof PRODUCT_CATEGORIES)[number]
export type CreateProductInput = z.infer<typeof createProductSchema>
export type ProductsListParams = z.output<typeof productsListQuerySchema>
export interface Product { id, name, ..., createdAt, updatedAt }
```

## 4. Layer API — `api/products.api.ts`

Fungsi fetch murni pakai `apiFetch` dari `@/lib/api-client`. Tidak ada state, tidak ada React.

## 5. Query Keys & Options — `api/products.queries.ts`

```ts
export const productsKeys = { all, lists(), list(params), details(), detail(id) }
export const productsQueries = {
  list: (params) => queryOptions({
    queryKey: productsKeys.list(params),
    queryFn: () => fetchProductsList(params),
    placeholderData: keepPreviousData,
  }),
}
```

## 6. Hooks — `hooks/`

| File | Isi |
| --- | --- |
| `use-products-params.ts` | Parser nuqs (`productsSearchParams`) + `useProductsParams()` + `toProductsListParams()` |
| `use-products-query.ts` | `useQuery(productsQueries.list(params))` |
| `use-create-product.ts`, `use-update-product.ts`, `use-delete-product.ts` | `useMutation` + toast + `invalidateQueries({ queryKey: xxxKeys.lists() })` |
| `use-products-table.ts` | Pola sama dengan `use-users-table.ts`: URL ⇄ table instance ⇄ query |
| `use-product-form.ts` | `useForm` + `zodResolver(createProductSchema)` |

## 7. Komponen — `components/`

Salin pola dari feature users:

1. `products-table-columns.tsx` — `createColumnHelper<DataTableFeatures, Product>()`
2. `products-table-toolbar.tsx` — SearchInput + Select filter terikat ke params
3. `products-data-table.tsx` — `<DataTable>` + `<DataTablePagination>`
4. `product-form-dialog.tsx` / `product-delete-dialog.tsx`
5. `products-page.tsx` — PageHeader + tabel + dialog create

Butuh konten rich text? Pakai komponen global `RichTextEditor` /
`RichTextView` (`components/rich-text-editor/`) — panduan lengkap:
[`rich-text.md`](./rich-text.md). Contoh pemakaian: fitur posts.

## 8. Public API — `index.ts`

Ekspor HANYA yang dibutuhkan luar: entry page component, keys/queries (jika perlu), skema, tipe.

## 9. Routing — `src/app/(dashboard)/products/page.tsx`

```tsx
import { Suspense } from "react"
import type { Metadata } from "next"
import { ProductsPage } from "@/features/products"

export const metadata: Metadata = { title: "Produk" }

export default function ProductsRoute() {
  return (
    <Suspense fallback={<ProductsRouteLoading />}>
      <ProductsPage />
    </Suspense>
  )
}
```

> Suspense wajib karena feature memakai `useSearchParams` (nuqs). Lihat pola fallback di `users/page.tsx`.

Tambahkan item navigasi di `src/config/navigation.ts`.

## 10. Mock Data (mode static export)

Template berjalan **full client-side**, jadi tidak ada route handler:

1. Buat `features/products/api/products.mock.ts` — store in-browser
   (seed data, filter/sort/pagination, latensi simulasi). Salin pola
   `features/users/api/users.mock.ts`.
2. `products.api.ts` mendelegasikan ke mock store. Kontrak fungsi
   dibuat seolah REST (`fetchProductsList`, dst.) agar nanti tinggal
   ditukar dengan `apiFetch` saat backend nyata ada.

## Checklist Akhir

- [ ] `pnpm exec tsc --noEmit` lolos
- [ ] `pnpm lint` bersih
- [ ] `pnpm build` sukses (perhatikan Suspense!)
- [ ] Refresh halaman → filter/search/sort/page tetap ada (URL)
- [ ] CRUD jalan + toast + data list ter-refresh otomatis
