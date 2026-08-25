"use client"

import { createColumnHelper } from "@tanstack/react-table"

import {
  DataTableColumnHeader,
  type DataTableFeatures,
} from "@/components/data-table"
import { Badge } from "@/components/ui/badge"
import { formatDate } from "@/lib/format"

import type { Post, PostStatus } from "../types/post.types"
import { POST_STATUS_OPTIONS } from "../constants/post.constants"
import { PostsTableRowActions } from "./posts-table-row-actions"

const columnHelper = createColumnHelper<DataTableFeatures, Post>()

const STATUS_BADGE_VARIANT: Record<
  PostStatus,
  "default" | "secondary" | "destructive" | "outline"
> = {
  published: "default",
  draft: "outline",
}

const statusLabels = new Map(
  POST_STATUS_OPTIONS.map((option) => [option.value, option.label]),
)

export const postsTableColumns = columnHelper.columns([
  columnHelper.accessor("title", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Judul" />
    ),
    cell: ({ row }) => (
      <span className="line-clamp-1 max-w-md font-medium">
        {row.original.title}
      </span>
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
    cell: ({ row }) => <PostsTableRowActions post={row.original} />,
  }),
])
