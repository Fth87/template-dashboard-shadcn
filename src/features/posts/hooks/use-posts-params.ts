"use client"

import {
  createLoader,
  parseAsInteger,
  parseAsString,
  parseAsStringLiteral,
  useQueryStates,
} from "nuqs"

import { DEFAULT_PAGE_SIZE } from "@/components/data-table"

import { DEFAULT_POSTS_SORT, POST_STATUSES, POSTS_SORTABLE_FIELDS, SORT_DIRECTIONS } from "../constants/post.constants"
import type { PostStatus, PostsListParams } from "../types/post.types"

/**
 * Kontrak query params URL untuk halaman posts — pola sama dengan users.
 * URL adalah satu-satunya sumber kebenaran state tabel.
 */
export const postsSearchParams = {
  q: parseAsString.withDefault(""),
  status: parseAsString.withDefault(""),
  sortBy: parseAsStringLiteral(POSTS_SORTABLE_FIELDS).withDefault(
    DEFAULT_POSTS_SORT.sortBy,
  ),
  sortDir: parseAsStringLiteral(SORT_DIRECTIONS).withDefault(
    DEFAULT_POSTS_SORT.sortDir,
  ),
  page: parseAsInteger.withDefault(1),
  perPage: parseAsInteger.withDefault(DEFAULT_PAGE_SIZE),
}

export function usePostsParams() {
  const [params, setParams] = useQueryStates(postsSearchParams)
  return { params, setParams }
}

type UsePostsParamsReturn = ReturnType<typeof usePostsParams>

export type PostsParamsValues = UsePostsParamsReturn["params"]
export type PostsParamsSetter = UsePostsParamsReturn["setParams"]

/** Loader sisi server (opsional, untuk Server Component). */
export const loadPostsParams = createLoader(postsSearchParams)

function isPostStatus(value: string): value is PostStatus {
  return (POST_STATUSES as readonly string[]).includes(value)
}

function clampPage(page: number): number {
  return Number.isFinite(page) && page >= 1 ? Math.floor(page) : 1
}

export function toPostsListParams(raw: PostsParamsValues): PostsListParams {
  return {
    q: raw.q,
    status: isPostStatus(raw.status) ? raw.status : undefined,
    sortBy: raw.sortBy,
    sortDir: raw.sortDir,
    page: clampPage(raw.page),
    perPage: raw.perPage,
  }
}
