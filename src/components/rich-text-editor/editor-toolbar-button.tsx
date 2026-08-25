"use client"

import type { ReactNode } from "react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface EditorToolbarButtonProps {
  /** Status aktif format (mis. editor.isActive("bold")). */
  isActive?: boolean
  onClick: () => void
  disabled?: boolean
  /** Label aksesibilitas + tooltip native. */
  label: string
  children: ReactNode
}

export function EditorToolbarButton({
  isActive = false,
  onClick,
  disabled = false,
  label,
  children,
}: EditorToolbarButtonProps) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-sm"
      aria-pressed={isActive}
      title={label}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "text-muted-foreground",
        isActive && "bg-muted text-foreground",
      )}
    >
      {children}
      <span className="sr-only">{label}</span>
    </Button>
  )
}
