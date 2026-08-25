"use client"

import type { RowData } from "@tanstack/react-table"
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { PAGE_SIZE_OPTIONS } from "./pagination-config"
import type { DataTableInstance } from "./data-table-types"

interface DataTablePaginationProps<TData extends RowData> {
  table: DataTableInstance<TData>
  /** Total baris (server-side). Dipakai karena tabel berjalan pada mode manual. */
  totalItems: number
}

export function DataTablePagination<TData extends RowData>({
  table,
  totalItems,
}: DataTablePaginationProps<TData>) {
  const { pageIndex, pageSize } = table.state.pagination
  const pageCount = Math.max(table.getPageCount(), 1)

  const firstRow = totalItems === 0 ? 0 : pageIndex * pageSize + 1
  const lastRow = Math.min((pageIndex + 1) * pageSize, totalItems)

  return (
    <div className="flex flex-col-reverse items-center gap-4 sm:flex-row sm:justify-between">
      <p className="text-sm text-muted-foreground">
        Menampilkan {firstRow}-{lastRow} dari {totalItems} data
      </p>

      <div className="flex items-center gap-6 lg:gap-8">
        <div className="flex items-center gap-2">
          <p className="hidden text-sm font-medium sm:block">Baris/halaman</p>
          <Select
            value={String(pageSize)}
            onValueChange={(value) => table.setPageSize(Number(value))}
          >
            <SelectTrigger size="sm" className="w-16">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PAGE_SIZE_OPTIONS.map((option) => (
                <SelectItem key={option} value={String(option)}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <p className="text-sm font-medium whitespace-nowrap tabular-nums">
          Halaman {pageIndex + 1} dari {pageCount}
        </p>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon-sm"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronsLeftIcon />
            <span className="sr-only">Ke halaman pertama</span>
          </Button>
          <Button
            variant="outline"
            size="icon-sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeftIcon />
            <span className="sr-only">Ke halaman sebelumnya</span>
          </Button>
          <Button
            variant="outline"
            size="icon-sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <ChevronRightIcon />
            <span className="sr-only">Ke halaman berikutnya</span>
          </Button>
          <Button
            variant="outline"
            size="icon-sm"
            onClick={() => table.setPageIndex(pageCount - 1)}
            disabled={!table.getCanNextPage()}
          >
            <ChevronsRightIcon />
            <span className="sr-only">Ke halaman terakhir</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
