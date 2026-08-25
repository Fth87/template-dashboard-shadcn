"use client"

import { ConfirmDialog } from "@/components/confirm-dialog"

import { useDeleteUser } from "../hooks/use-delete-user"
import type { User } from "../types/user.types"

interface UserDeleteDialogProps {
  user: User
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function UserDeleteDialog({
  user,
  open,
  onOpenChange,
}: UserDeleteDialogProps) {
  const deleteMutation = useDeleteUser()

  async function handleConfirm() {
    try {
      await deleteMutation.mutateAsync(user.id)
      onOpenChange(false)
    } catch {
      // Toast error sudah ditangani di hook mutation.
    }
  }

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title={`Hapus "${user.name}"?`}
      description="Pengguna akan dihapus secara permanen. Tindakan ini tidak dapat dibatalkan."
      confirmLabel="Hapus"
      destructive
      loading={deleteMutation.isPending}
      onConfirm={() => void handleConfirm()}
    />
  )
}
