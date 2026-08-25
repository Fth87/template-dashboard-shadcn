"use client"

import type { RowData } from "@tanstack/react-table"

import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import type { DataTableInstance } from "./data-table-types"

const SKELETON_ROW_COUNT = 6

interface DataTableProps<TData extends RowData> {
  table: DataTableInstance<TData>
  columns: number
  isLoading?: boolean
  /** True saat refetch di background (misal ganti halaman) — baris diredupkan. */
  isRefreshing?: boolean
  /** Slot untuk toolbar (search, filter, aksi) di atas tabel. */
  children?: React.ReactNode
  /** Slot untuk pagination di bawah tabel. */
  footer?: React.ReactNode
}

export function DataTable<TData extends RowData>({
  table,
  columns,
  isLoading = false,
  isRefreshing = false,
  children,
  footer,
}: DataTableProps<TData>) {
  const rows = table.getRowModel().rows
  const pageSize = table.state.pagination.pageSize

  return (
    <div className="flex flex-col gap-4">
      {children}

      <div className="overflow-hidden rounded-xl border">
        <Table>
          <TableHeader className="bg-muted/50">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : (
                      <table.FlexRender header={header} />
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody
            className={isRefreshing ? "opacity-50 transition-opacity" : undefined}
          >
            {isLoading ? (
              Array.from({ length: Math.min(SKELETON_ROW_COUNT, pageSize) }).map(
                (_, rowIndex) => (
                  <TableRow key={`skeleton-${rowIndex}`}>
                    {Array.from({ length: columns }).map((_, columnIndex) => (
                      <TableCell key={`skeleton-${rowIndex}-${columnIndex}`}>
                        <Skeleton className="h-4 w-full max-w-32" />
                      </TableCell>
                    ))}
                  </TableRow>
                ),
              )
            ) : rows.length > 0 ? (
              rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      <table.FlexRender cell={cell} />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns} className="h-24 text-center">
                  Tidak ada data yang cocok.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {footer}
    </div>
  )
}
