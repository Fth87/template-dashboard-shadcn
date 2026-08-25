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

import { usersTableColumns } from "../components/users-table-columns"
import { USERS_SORTABLE_FIELDS } from "../constants/user.constants"
import { toUsersListParams, useUsersParams } from "./use-users-params"
import { useUsersList } from "./use-users-query"

/** Referensi stabil agar data tidak "berkedip" saat refetch pertama. */
const EMPTY_ITEMS: never[] = []

function isSortableField(
  columnId: string,
): columnId is (typeof USERS_SORTABLE_FIELDS)[number] {
  return (USERS_SORTABLE_FIELDS as readonly string[]).includes(columnId)
}

/**
 * Otak tabel users: menyatukan state URL (nuqs), query data
 * (TanStack Query), dan instance TanStack Table.
 *
 * Tabel berjalan pada mode **manual** (pagination & sorting di-server),
 * sehingga state tabel ditulis ke URL dan dibaca kembali dari sana.
 */
export function useUsersTable() {
  const { params, setParams } = useUsersParams()
  const listParams = toUsersListParams(params)
  const usersQuery = useUsersList(listParams)

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
      // Ganti ukuran halaman → selalu kembali ke halaman pertama.
      void setParams({ perPage: next.pageSize, page: null })
      return
    }

    void setParams({ page: next.pageIndex + 1 })
  }

  function handleSortingChange(updater: Updater<SortingState>) {
    const next = functionalUpdate(updater, sorting)
    // Template ini memakai sorting kolom tunggal (paling umum untuk CRUD).
    const firstColumn = next.at(0)

    if (!firstColumn) {
      void setParams({
        sortBy: null,
        sortDir: null,
      })
      return
    }

    // Kolom "actions" tidak punya accessor — abaikan jika pernah masuk state.
    const sortableColumnId = isSortableField(firstColumn.id)
      ? firstColumn.id
      : null

    void setParams({
      sortBy: sortableColumnId,
      sortDir: sortableColumnId !== null && firstColumn.desc ? "desc" : null,
    })
  }

  /**
   * Visibilitas kolom: state lokal (pola resmi demo shadcn/ui Tasks).
   * Sengaja tidak masuk URL karena tidak memengaruhi data yang diambil.
   */
  const [columnVisibility, setColumnVisibility] =
    React.useState<ColumnVisibilityState>({})

  const table = useTable({
    features: dataTableFeatures,
    data: usersQuery.data?.items ?? EMPTY_ITEMS,
    columns: usersTableColumns,
    state: { pagination, sorting, columnVisibility },
    onPaginationChange: handlePaginationChange,
    onSortingChange: handleSortingChange,
    onColumnVisibilityChange: setColumnVisibility,
    // Data sudah difilter/di-sort/dipaginasi oleh server.
    manualPagination: true,
    manualSorting: true,
    rowCount: usersQuery.data?.meta.totalItems ?? 0,
  })

  /**
   * Self-healing URL: server meng-clamp `page` bila melebihi totalPages
   * (mis. setelah filter menyusutkan hasil). Sinkronkan kembali ke URL
   * agar angka "Halaman X" selalu cocok dengan data yang tampil.
   */
  React.useEffect(() => {
    const meta = usersQuery.data?.meta

    if (!meta || usersQuery.isPlaceholderData) return
    if (meta.page !== listParams.page) {
      void setParams({ page: meta.page })
    }
  }, [usersQuery.data, usersQuery.isPlaceholderData, listParams.page, setParams])

  return {
    table,
    query: usersQuery,
    /** Params mentah dari URL (untuk mengisi nilai toolbar). */
    params,
    setParams,
    /** Params tervalidasi yang sedang dipakai fetch. */
    listParams,
  }
}
