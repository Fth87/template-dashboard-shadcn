"use client"

import { useState } from "react"

import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"

import { UserFormDialog } from "./user-form-dialog"
import { UsersDataTable } from "./users-data-table"

/**
 * Entry point fitur users. Satu-satunya komponen yang diekspor
 * ke luar feature (dipanggil dari `app/(dashboard)/users/page.tsx`).
 */
export function UsersPage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Pengguna"
        description="Kelola pengguna aplikasi: cari, filter, tambah, ubah, dan hapus."
      >
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          Tambah Pengguna
        </Button>
      </PageHeader>

      <UsersDataTable />

      <UserFormDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
      />
    </div>
  )
}
