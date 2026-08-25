"use client"

import { useState } from "react"
import { MoreHorizontalIcon, PencilIcon, Trash2Icon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import type { User } from "../types/user.types"
import { UserDeleteDialog } from "./user-delete-dialog"
import { UserFormDialog } from "./user-form-dialog"

type RowAction = "edit" | "delete" | null

interface UsersTableRowActionsProps {
  user: User
}

/**
 * Aksi per baris (edit/hapus) beserta dialog-nya.
 * State dialog dikelola lokal di sini agar tabel tidak perlu tahu detailnya.
 */
export function UsersTableRowActions({ user }: UsersTableRowActionsProps) {
  const [activeAction, setActiveAction] = useState<RowAction>(null)

  return (
    <>
      <div className="flex justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger
            render={<Button variant="ghost" size="icon-sm" />}
          >
            <MoreHorizontalIcon />
            <span className="sr-only">Buka menu aksi</span>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setActiveAction("edit")}>
              <PencilIcon />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-destructive focus:**:text-destructive"
              onClick={() => setActiveAction("delete")}
            >
              <Trash2Icon />
              Hapus
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Kondisional agar form selalu fresh setiap kali dibuka. */}
      {activeAction === "edit" && (
        <UserFormDialog
          user={user}
          open
          onOpenChange={(open) => !open && setActiveAction(null)}
        />
      )}

      {activeAction === "delete" && (
        <UserDeleteDialog
          user={user}
          open
          onOpenChange={(open) => !open && setActiveAction(null)}
        />
      )}
    </>
  )
}
