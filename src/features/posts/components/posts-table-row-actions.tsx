"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import {
  EyeIcon,
  MoreHorizontalIcon,
  PencilIcon,
  Trash2Icon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import type { Post } from "../types/post.types"
import { PostDeleteDialog } from "./post-delete-dialog"
import { PostViewDialog } from "./post-view-dialog"

type RowAction = "view" | "delete" | null

interface PostsTableRowActionsProps {
  post: Post
}

/**
 * Aksi per baris: Lihat (dialog baca), Edit (halaman penuh), Hapus.
 * Edit sengaja diarahkan ke halaman `/posts/[id]/edit` agar menulis
 * konten panjang nyaman dan aman dari dialog yang tertutup tidak sengaja.
 */
export function PostsTableRowActions({ post }: PostsTableRowActionsProps) {
  const router = useRouter()
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
            <DropdownMenuItem onClick={() => setActiveAction("view")}>
              <EyeIcon />
              Lihat
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => router.push(`/posts/edit?id=${post.id}`)}
            >
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

      {/* Dialog dirender kondisional agar state selalu fresh. */}
      {activeAction === "view" && (
        <PostViewDialog
          post={post}
          open
          onOpenChange={(open) => !open && setActiveAction(null)}
        />
      )}

      {activeAction === "delete" && (
        <PostDeleteDialog
          post={post}
          open
          onOpenChange={(open) => !open && setActiveAction(null)}
        />
      )}
    </>
  )
}
