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

import type {
  UsersParamsSetter,
  UsersParamsValues,
} from "../hooks/use-users-params"
import {
  USER_ROLE_OPTIONS,
  USER_STATUS_OPTIONS,
} from "../constants/user.constants"

const statusFilterItems: Record<string, string> = {
  "": "Semua status",
  ...Object.fromEntries(
    USER_STATUS_OPTIONS.map((option) => [option.value, option.label]),
  ),
}

const roleFilterItems: Record<string, string> = {
  "": "Semua peran",
  ...Object.fromEntries(
    USER_ROLE_OPTIONS.map((option) => [option.value, option.label]),
  ),
}

interface UsersTableToolbarProps {
  params: UsersParamsValues
  setParams: UsersParamsSetter
}

function isDefaultValue(value: string, defaultValue: string): boolean {
  return value === defaultValue
}

export function UsersTableToolbar({ params, setParams }: UsersTableToolbarProps) {
  const hasActiveFilters =
    !isDefaultValue(params.q, "") ||
    !isDefaultValue(params.status, "") ||
    !isDefaultValue(params.role, "")

  return (
    <div className="flex flex-col gap-2 lg:flex-row lg:items-center">
      <SearchInput
        value={params.q}
        placeholder="Cari nama atau email…"
        aria-label="Cari pengguna"
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

        <Select
          items={roleFilterItems}
          value={params.role}
          onValueChange={(value) =>
            void setParams({ role: value || null, page: null })
          }
        >
          <SelectTrigger aria-label="Filter peran" className="w-full sm:w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(roleFilterItems).map(([value, label]) => (
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
                role: null,
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
