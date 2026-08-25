"use client"

import type { Column, RowData } from "@tanstack/react-table"
import {
  ArrowDownIcon,
  ArrowUpIcon,
  ChevronsUpDownIcon,
  XIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

import type { DataTableFeatures } from "./data-table-features"

interface DataTableColumnHeaderProps<TData extends RowData, TValue>
  extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<DataTableFeatures, TData, TValue>
  title: string
}

export function DataTableColumnHeader<TData extends RowData, TValue>({
  column,
  title,
  className,
}: DataTableColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort()) {
    return <div className={cn(className)}>{title}</div>
  }

  const sortedDirection = column.getIsSorted()

  return (
    <div className={cn("flex items-center", className)}>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              variant="ghost"
              size="sm"
              className="-ml-2.5 h-7 has-data-[icon=inline-end]:pr-1.5"
            />
          }
        >
          <span>{title}</span>
          {sortedDirection === "desc" ? (
            <ArrowDownIcon data-icon="inline-end" />
          ) : sortedDirection === "asc" ? (
            <ArrowUpIcon data-icon="inline-end" />
          ) : (
            <ChevronsUpDownIcon
              data-icon="inline-end"
              className="text-muted-foreground"
            />
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem onClick={() => column.toggleSorting(false)}>
            <ArrowUpIcon />
            Naik (A-Z)
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => column.toggleSorting(true)}>
            <ArrowDownIcon />
            Turun (Z-A)
          </DropdownMenuItem>
          {sortedDirection !== false && (
            <DropdownMenuItem onClick={() => column.clearSorting()}>
              <XIcon />
              Hapus urutan
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
