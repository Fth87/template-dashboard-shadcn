import type { Metadata } from "next"
import { Suspense } from "react"

import { Skeleton } from "@/components/ui/skeleton"
import { PostsPage } from "@/features/posts"

export const metadata: Metadata = {
  title: "Artikel",
}

function PostsRouteLoading() {
  return (
    <div className="flex flex-col gap-6">
      <div className="space-y-2">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-4 w-80" />
      </div>
      <div className="flex gap-2">
        <Skeleton className="h-9 w-full max-w-xs" />
        <Skeleton className="h-9 w-40" />
      </div>
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, index) => (
          <Skeleton key={index} className="h-10 w-full" />
        ))}
      </div>
    </div>
  )
}

/**
 * Routing saja — seluruh logika & UI ada di feature `posts`.
 * Suspense wajib karena feature memakai `useSearchParams` (nuqs).
 */
export default function PostsRoute() {
  return (
    <Suspense fallback={<PostsRouteLoading />}>
      <PostsPage />
    </Suspense>
  )
}
