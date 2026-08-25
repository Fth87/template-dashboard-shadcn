"use client"

import { createColumnHelper } from "@tanstack/react-table"

import {
  DataTableColumnHeader,
  type DataTableFeatures,
} from "@/components/data-table"
import { Badge } from "@/components/ui/badge"
import { formatDate } from "@/lib/format"

import type { User, UserStatus } from "../types/user.types"
import {
  USER_ROLE_OPTIONS,
  USER_STATUS_OPTIONS,
} from "../constants/user.constants"
import { UsersTableRowActions } from "./users-table-row-actions"

const columnHelper = createColumnHelper<DataTableFeatures, User>()

const STATUS_BADGE_VARIANT: Record<
  UserStatus,
  "default" | "secondary" | "destructive" | "outline"
> = {
  active: "default",
  inactive: "secondary",
  suspended: "destructive",
}

const statusLabels = new Map(
  USER_STATUS_OPTIONS.map((option) => [option.value, option.label]),
)

const roleLabels = new Map(
  USER_ROLE_OPTIONS.map((option) => [option.value, option.label]),
)

/**
 * Definisi kolom tabel users.
 * Hanya berisi mapping data → tampilan; state dan perilaku tabel
 * ada di `useUsersTable`.
 */
export const usersTableColumns = columnHelper.columns([
  columnHelper.accessor("name", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nama" />
    ),
    cell: ({ row }) => <span className="font-medium">{row.original.name}</span>,
  }),

  columnHelper.accessor("email", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
    cell: ({ row }) => (
      <span className="text-muted-foreground">{row.original.email}</span>
    ),
  }),

  columnHelper.accessor("role", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Peran" />
    ),
    cell: ({ row }) => (
      <Badge variant="outline">{roleLabels.get(row.original.role)}</Badge>
    ),
  }),

  columnHelper.accessor("status", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => (
      <Badge variant={STATUS_BADGE_VARIANT[row.original.status]}>
        {statusLabels.get(row.original.status)}
      </Badge>
    ),
  }),

  columnHelper.accessor("createdAt", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Dibuat" />
    ),
    cell: ({ row }) => (
      <span className="whitespace-nowrap text-muted-foreground">
        {formatDate(row.original.createdAt)}
      </span>
    ),
  }),

  columnHelper.display({
    id: "actions",
    cell: ({ row }) => <UsersTableRowActions user={row.original} />,
  }),
])
