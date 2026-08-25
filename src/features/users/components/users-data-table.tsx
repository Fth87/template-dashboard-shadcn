"use client"

import {
  DataTable,
  DataTablePagination,
  DataTableViewOptions,
} from "@/components/data-table"

import { useUsersTable } from "../hooks/use-users-table"
import { usersTableColumns } from "./users-table-columns"
import { UsersTableToolbar } from "./users-table-toolbar"

/**
 * Merangkai toolbar, tabel, dan pagination untuk fitur users.
 * Semua state hidup di URL (lihat `useUsersTable`).
 */
export function UsersDataTable() {
  const { table, query, params, setParams } = useUsersTable()

  return (
    <DataTable
      table={table}
      columns={usersTableColumns.length}
      isLoading={query.isPending}
      isRefreshing={query.isFetching && !query.isPending}
      footer={
        <DataTablePagination
          table={table}
          totalItems={query.data?.meta.totalItems ?? 0}
        />
      }
    >
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <UsersTableToolbar params={params} setParams={setParams} />
        {/* Toggle kolom (pola resmi shadcn Data Table). */}
        <DataTableViewOptions table={table} />
      </div>
    </DataTable>
  )
}
