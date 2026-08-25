"use client"

import { SearchIcon, XIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface SearchInputProps extends Omit<React.ComponentProps<"input">, "value" | "onChange" | "type"> {
  value: string
  onValueChange: (value: string) => void
}

/**
 * Input pencarian presentasional (molekul).
 * State tidak disimpan di sini — nilai terikat penuh ke pemanggil
 * (umumnya URL query params) agar tetap satu sumber kebenaran.
 */
export function SearchInput({
  value,
  onValueChange,
  className,
  ...props
}: SearchInputProps) {
  return (
    <div className={cn("relative w-full sm:max-w-xs", className)}>
      <SearchIcon className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="search"
        value={value}
        onChange={(event) => onValueChange(event.target.value)}
        className="pr-8 pl-8"
        {...props}
      />
      {value.length > 0 && (
        <Button
          variant="ghost"
          size="icon-xs"
          className="absolute top-1/2 right-1.5 -translate-y-1/2 text-muted-foreground"
          onClick={() => onValueChange("")}
          aria-label="Bersihkan pencarian"
        >
          <XIcon />
        </Button>
      )}
    </div>
  )
}
