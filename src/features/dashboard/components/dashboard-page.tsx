"use client"

import Link from "next/link"
import {
  CircleCheckIcon,
  CirclePauseIcon,
  UserPlusIcon,
  UsersIcon,
} from "lucide-react"

import { PageHeader } from "@/components/page-header"
import { buttonVariants } from "@/components/ui/button"
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useDashboardStats } from "../hooks/use-dashboard-stats"
import { UserStatusChart } from "./user-status-chart"
import { UsersGrowthChart } from "./users-growth-chart"

interface StatCardProps {
  title: string
  value?: number
  icon: React.ComponentType<{ className?: string }>
  footer: string
}

function StatCard({ title, value, icon: Icon, footer }: StatCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="space-y-1">
          <CardDescription>{title}</CardDescription>
          <CardTitle className="text-2xl tabular-nums">
            {value === undefined ? (
              <Skeleton className="h-7 w-12" />
            ) : (
              value
            )}
          </CardTitle>
        </div>
        <Icon className="size-4 text-muted-foreground" />
      </CardHeader>
      <CardFooter className="text-xs text-muted-foreground">{footer}</CardFooter>
    </Card>
  )
}

/**
 * Entry point halaman dashboard (client-side).
 * Statistik diambil via TanStack Query — tidak ada kode server.
 */
export function DashboardPage() {
  const statsQuery = useDashboardStats()

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Dashboard"
        description="Ringkasan singkat data aplikasi."
      >
        {/* Link ber-tampilan button (best practice shadcn Base UI). */}
        <Link href="/users" className={buttonVariants()}>
          <UserPlusIcon data-icon="inline-start" />
          Kelola Pengguna
        </Link>
      </PageHeader>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Pengguna"
          value={statsQuery.data?.total}
          icon={UsersIcon}
          footer="Jumlah seluruh pengguna terdaftar"
        />
        <StatCard
          title="Pengguna Aktif"
          value={statsQuery.data?.active}
          icon={CircleCheckIcon}
          footer="Sedang aktif menggunakan aplikasi"
        />
        <StatCard
          title="Tidak Aktif"
          value={statsQuery.data?.inactive}
          icon={CirclePauseIcon}
          footer="Belum pernah login dalam 30 hari"
        />
        <StatCard
          title="Ditangguhkan"
          value={statsQuery.data?.suspended}
          icon={CirclePauseIcon}
          footer="Akses dinonaktifkan sementara"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <UsersGrowthChart />
        </div>
        <div className="lg:col-span-2">
          <UserStatusChart />
        </div>
      </div>
    </div>
  )
}
