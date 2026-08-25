"use client"

import {
  DataTable,
  DataTablePagination,
  DataTableViewOptions,
} from "@/components/data-table"

import { usePostsTable } from "../hooks/use-posts-table"
import { postsTableColumns } from "./posts-table-columns"
import { PostsTableToolbar } from "./posts-table-toolbar"

/**
 * Merangkai toolbar, tabel, dan pagination untuk fitur posts.
 * Semua state hidup di URL (lihat `usePostsTable`).
 */
export function PostsDataTable() {
  const { table, query, params, setParams } = usePostsTable()

  return (
    <DataTable
      table={table}
      columns={postsTableColumns.length}
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
        <PostsTableToolbar params={params} setParams={setParams} />
        <DataTableViewOptions table={table} />
      </div>
    </DataTable>
  )
}
