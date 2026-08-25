"use client"

import * as React from "react"

import {
  functionalUpdate,
  useTable,
  type ColumnVisibilityState,
  type PaginationState,
  type SortingState,
  type Updater,
} from "@tanstack/react-table"

import { dataTableFeatures } from "@/components/data-table"

import { postsTableColumns } from "../components/posts-table-columns"
import { POSTS_SORTABLE_FIELDS } from "../constants/post.constants"
import { toPostsListParams, usePostsParams } from "./use-posts-params"
import { usePostsList } from "./use-posts-query"

const EMPTY_ITEMS: never[] = []

function isSortableField(
  columnId: string,
): columnId is (typeof POSTS_SORTABLE_FIELDS)[number] {
  return (POSTS_SORTABLE_FIELDS as readonly string[]).includes(columnId)
}

/**
 * Otak tabel posts — pola identik dengan `use-users-table.ts`:
 * URL (nuqs) ⇄ instance TanStack Table ⇄ TanStack Query.
 */
export function usePostsTable() {
  const { params, setParams } = usePostsParams()
  const listParams = toPostsListParams(params)
  const postsQuery = usePostsList(listParams)

  const pagination: PaginationState = {
    pageIndex: params.page - 1,
    pageSize: params.perPage,
  }

  const sorting: SortingState = [
    { id: params.sortBy, desc: params.sortDir === "desc" },
  ]

  function handlePaginationChange(updater: Updater<PaginationState>) {
    const next = functionalUpdate(updater, pagination)

    if (next.pageSize !== pagination.pageSize) {
      void setParams({ perPage: next.pageSize, page: null })
      return
    }

    void setParams({ page: next.pageIndex + 1 })
  }

  function handleSortingChange(updater: Updater<SortingState>) {
    const next = functionalUpdate(updater, sorting)
    const firstColumn = next.at(0)

    if (!firstColumn) {
      void setParams({ sortBy: null, sortDir: null })
      return
    }

    const sortableColumnId = isSortableField(firstColumn.id)
      ? firstColumn.id
      : null

    void setParams({
      sortBy: sortableColumnId,
      sortDir: sortableColumnId !== null && firstColumn.desc ? "desc" : null,
    })
  }

  const [columnVisibility, setColumnVisibility] =
    React.useState<ColumnVisibilityState>({})

  const table = useTable({
    features: dataTableFeatures,
    data: postsQuery.data?.items ?? EMPTY_ITEMS,
    columns: postsTableColumns,
    state: { pagination, sorting, columnVisibility },
    onPaginationChange: handlePaginationChange,
    onSortingChange: handleSortingChange,
    onColumnVisibilityChange: setColumnVisibility,
    manualPagination: true,
    manualSorting: true,
    rowCount: postsQuery.data?.meta.totalItems ?? 0,
  })

  // Self-healing URL saat penyedia data meng-clamp halaman.
  React.useEffect(() => {
    const meta = postsQuery.data?.meta

    if (!meta || postsQuery.isPlaceholderData) return
    if (meta.page !== listParams.page) {
      void setParams({ page: meta.page })
    }
  }, [postsQuery.data, postsQuery.isPlaceholderData, listParams.page, setParams])

  return {
    table,
    query: postsQuery,
    params,
    setParams,
    listParams,
  }
}
