"use client"

import { RichTextView } from "@/components/rich-text-editor"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { formatDate } from "@/lib/format"

import type { Post } from "../types/post.types"
import { POST_STATUS_OPTIONS } from "../constants/post.constants"

interface PostViewDialogProps {
  post: Post
  open: boolean
  onOpenChange: (open: boolean) => void
}

const statusLabels = new Map(
  POST_STATUS_OPTIONS.map((option) => [option.value, option.label]),
)

/**
 * Cara menampilkan artikel yang disimpan sebagai JSON Tiptap:
 * dirender ulang menjadi HTML via `RichTextView` (static-renderer)
 * di dalam container `prose`.
 */
export function PostViewDialog({ post, open, onOpenChange }: PostViewDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline">
              {statusLabels.get(post.status)}
            </Badge>
            <DialogDescription className="text-xs">
              Dibuat {formatDate(post.createdAt)} · Diubah{" "}
              {formatDate(post.updatedAt)}
            </DialogDescription>
          </div>
          <DialogTitle className="text-left leading-snug">
            {post.title}
          </DialogTitle>
        </DialogHeader>

        <RichTextView content={post.content} />
      </DialogContent>
    </Dialog>
  )
}
