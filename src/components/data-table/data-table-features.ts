import {
  columnVisibilityFeature,
  rowPaginationFeature,
  rowSortingFeature,
  sortFn_alphanumeric,
  sortFn_text,
  tableFeatures,
} from "@tanstack/react-table"

/**
 * Fitur TanStack Table yang dipakai semua tabel di aplikasi ini.
 *
 * v9 bersifat opt-in (feature-based): hanya fitur yang didaftarkan di sini
 * yang akan ter-bundle, sisanya otomatis tree-shaken.
 *
 * Catatan: `columnVisibilityFeature` wajib didaftarkan karena API
 * `row.getVisibleCells()` yang dipakai saat render berada di fitur tersebut.
 */
export const dataTableFeatures = tableFeatures({
  rowSortingFeature,
  rowPaginationFeature,
  columnVisibilityFeature,
  sortFns: {
    alphanumeric: sortFn_alphanumeric,
    text: sortFn_text,
  },
})

export type DataTableFeatures = typeof dataTableFeatures
