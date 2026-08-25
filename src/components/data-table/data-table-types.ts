import type { ReactTable, RowData } from "@tanstack/react-table"

import type { DataTableFeatures } from "./data-table-features"

/**
 * Alias tipe instance tabel agar komponen feature tidak perlu
 * menulis generic TanStack Table secara manual.
 */
export type DataTableInstance<TData extends RowData> = ReactTable<
  DataTableFeatures,
  TData
>
