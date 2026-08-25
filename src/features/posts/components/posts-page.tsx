"use client"

import Link from "next/link"
import { FilePlus2Icon } from "lucide-react"

import { PageHeader } from "@/components/page-header"
import { buttonVariants } from "@/components/ui/button"

import { PostsDataTable } from "./posts-data-table"

/**
 * Entry point fitur posts. Satu-satunya komponen yang diekspor
 * ke luar feature (dipanggil dari `app/(dashboard)/posts/page.tsx`).
 */
export function PostsPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Artikel"
        description="Kelola artikel dengan editor rich text: tulis, baca, ubah, dan hapus."
      >
        {/* Create memakai halaman penuh, bukan dialog, agar nyaman
            menulis konten panjang (lihat /posts/new). */}
        <Link href="/posts/new" className={buttonVariants()}>
          <FilePlus2Icon data-icon="inline-start" />
          Tambah Artikel
        </Link>
      </PageHeader>

      <PostsDataTable />
    </div>
  )
}
