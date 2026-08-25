"use client"

import Link from "next/link"
import { FileQuestionIcon } from "lucide-react"
import { parseAsString, useQueryStates } from "nuqs"

import { PageHeader } from "@/components/page-header"
import { buttonVariants } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

import { usePostDetail } from "../hooks/use-post-detail"
import { PostForm } from "./post-form"

/** Kontrak URL halaman edit: /posts/edit?id=<postId> */
const editPostSearchParams = {
  id: parseAsString.withDefault(""),
}

/**
 * Wrapper halaman edit: baca `?id=` dari URL (nuqs), ambil artikelnya
 * via TanStack Query (tahan refresh), lalu render form.
 */
export function EditPostPage() {
  const [{ id }] = useQueryStates(editPostSearchParams)
  const postQuery = usePostDetail(id, { enabled: id !== "" })

  if (id === "") {
    return <MissingPost />
  }

  if (postQuery.isPending) {
    return (
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-56" />
          <Skeleton className="h-4 w-72" />
        </div>
        <Card>
          <CardContent className="space-y-4">
            <Skeleton className="h-9 w-full" />
            <Skeleton className="h-9 w-44" />
            <Skeleton className="h-[240px] w-full" />
          </CardContent>
        </Card>
      </div>
    )
  }

  if (postQuery.isError || !postQuery.data) {
    return <MissingPost />
  }

  return <PostForm post={postQuery.data} />
}

function MissingPost() {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
      <PageHeader title="Artikel tidak ditemukan" />
      <Card>
        <CardContent className="flex flex-col items-center gap-4 py-10 text-center">
          <FileQuestionIcon className="size-10 text-muted-foreground/50" />
          <p className="text-sm text-muted-foreground">
            Artikel mungkin sudah dihapus atau tautan tidak lengkap
            (butuh parameter <code>?id=</code>).
          </p>
          <Link href="/posts" className={buttonVariants({ variant: "outline" })}>
            Kembali ke Daftar
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
