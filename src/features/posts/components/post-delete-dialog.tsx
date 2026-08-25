"use client"

import { ConfirmDialog } from "@/components/confirm-dialog"

import { useDeletePost } from "../hooks/use-delete-post"
import type { Post } from "../types/post.types"

interface PostDeleteDialogProps {
  post: Post
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function PostDeleteDialog({
  post,
  open,
  onOpenChange,
}: PostDeleteDialogProps) {
  const deleteMutation = useDeletePost()

  async function handleConfirm() {
    try {
      await deleteMutation.mutateAsync(post.id)
      onOpenChange(false)
    } catch {
      // Toast error sudah ditangani di hook mutation.
    }
  }

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title={`Hapus "${post.title}"?`}
      description="Artikel akan dihapus secara permanen. Tindakan ini tidak dapat dibatalkan."
      confirmLabel="Hapus"
      destructive
      loading={deleteMutation.isPending}
      onConfirm={() => void handleConfirm()}
    />
  )
}
