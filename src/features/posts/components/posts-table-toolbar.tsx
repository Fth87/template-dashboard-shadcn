"use client"

import { RotateCcwIcon } from "lucide-react"

import { SearchInput } from "@/components/search-input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import type { PostsParamsSetter, PostsParamsValues } from "../hooks/use-posts-params"
import { POST_STATUS_OPTIONS } from "../constants/post.constants"

const statusFilterItems: Record<string, string> = {
  "": "Semua status",
  ...Object.fromEntries(
    POST_STATUS_OPTIONS.map((option) => [option.value, option.label]),
  ),
}

interface PostsTableToolbarProps {
  params: PostsParamsValues
  setParams: PostsParamsSetter
}

export function PostsTableToolbar({ params, setParams }: PostsTableToolbarProps) {
  const hasActiveFilters =
    params.q !== "" || params.status !== ""

  return (
    <div className="flex flex-col gap-2 lg:flex-row lg:items-center">
      <SearchInput
        value={params.q}
        placeholder="Cari judul artikel…"
        aria-label="Cari artikel"
        onValueChange={(value) => void setParams({ q: value || null, page: null })}
      />

      <div className="flex flex-wrap items-center gap-2">
        <Select
          items={statusFilterItems}
          value={params.status}
          onValueChange={(value) =>
            void setParams({ status: value || null, page: null })
          }
        >
          <SelectTrigger aria-label="Filter status" className="w-full sm:w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(statusFilterItems).map(([value, label]) => (
              <SelectItem key={value || "all"} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() =>
              void setParams({
                q: null,
                status: null,
                sortBy: null,
                sortDir: null,
                page: null,
                perPage: null,
              })
            }
          >
            <RotateCcwIcon />
            Reset
          </Button>
        )}
      </div>
    </div>
  )
}
