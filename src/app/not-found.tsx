import Link from "next/link"

import { buttonVariants } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-4 p-6 text-center">
      <p className="font-heading text-7xl font-bold tracking-tight text-muted-foreground/40">
        404
      </p>
      <div className="space-y-1">
        <h1 className="text-xl font-semibold">Halaman tidak ditemukan</h1>
        <p className="text-sm text-muted-foreground">
          Halaman yang kamu cari tidak ada atau sudah dipindahkan.
        </p>
      </div>
      {/* Link ber-tampilan button memakai buttonVariants (best practice shadcn). */}
      <Link href="/dashboard" className={buttonVariants()}>
        Kembali ke Dashboard
      </Link>
    </div>
  )
}
