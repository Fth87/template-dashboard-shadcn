import type { Metadata } from "next"
import { Suspense } from "react"

import { Skeleton } from "@/components/ui/skeleton"
import { UsersPage } from "@/features/users"

export const metadata: Metadata = {
  title: "Pengguna",
}

function UsersRouteLoading() {
  return (
    <div className="flex flex-col gap-6">
      <div className="space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-72" />
      </div>
      <div className="flex gap-2">
        <Skeleton className="h-9 w-full max-w-xs" />
        <Skeleton className="h-9 w-40" />
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
 * Routing saja — seluruh logika & UI ada di feature `users`.
 *
 * `useSearchParams` (via nuqs) di dalam feature memerlukan Suspense
 * boundary agar halaman tetap bisa di-prerender secara statis.
 */
export default function UsersRoute() {
  return (
    <Suspense fallback={<UsersRouteLoading />}>
      <UsersPage />
    </Suspense>
  )
}
