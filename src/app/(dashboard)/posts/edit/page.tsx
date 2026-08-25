import type { Metadata } from "next"
import { Suspense } from "react"

import { Skeleton } from "@/components/ui/skeleton"
import { EditPostPage } from "@/features/posts/components/edit-post-page"

export const metadata: Metadata = {
  title: "Edit Artikel",
}

function EditPostRouteLoading() {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
      <div className="space-y-2">
        <Skeleton className="h-8 w-56" />
        <Skeleton className="h-4 w-72" />
      </div>
      <Skeleton className="h-[420px] w-full rounded-xl" />
    </div>
  )
}

/**
 * Halaman edit artikel memakai query param `?id=` (bukan path param)
 * karena output: export tidak mendukung dynamic path yang tidak
 * diketahui saat build — ID dibaca client-side via nuqs.
 * Suspense wajib untuk useSearchParams.
 */
export default function EditPostRoute() {
  return (
    <Suspense fallback={<EditPostRouteLoading />}>
      <EditPostPage />
    </Suspense>
  )
}
