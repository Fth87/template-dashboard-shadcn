import type { ChartConfig } from "@/components/ui/chart"

/**
 * Data dummy untuk contoh chart dashboard.
 * Saat backend nyata ada, ganti sumbernya dari response API —
 * bentuk data & config tidak perlu berubah.
 */

export interface MonthlyGrowthDatum {
  /** Label bulan singkat (mis. "Jan"). */
  month: string
  /** Jumlah pengguna baru pada bulan tersebut. */
  users: number
}

export const MONTHLY_USER_GROWTH: MonthlyGrowthDatum[] = [
  { month: "Sep", users: 8 },
  { month: "Okt", users: 14 },
  { month: "Nov", users: 11 },
  { month: "Des", users: 19 },
  { month: "Jan", users: 16 },
  { month: "Feb", users: 24 },
  { month: "Mar", users: 21 },
  { month: "Apr", users: 29 },
  { month: "Mei", users: 26 },
  { month: "Jun", users: 34 },
  { month: "Jul", users: 31 },
  { month: "Ags", users: 38 },
]

export const monthlyUserGrowthConfig = {
  users: {
    label: "Pengguna baru",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

export interface StatusDistributionDatum {
  status: "active" | "inactive" | "suspended"
  count: number
  /** Warna otomatis dari chart config (pola resmi shadcn). */
  fill: string
}

export const USER_STATUS_DISTRIBUTION: StatusDistributionDatum[] = [
  { status: "active", count: 12, fill: "var(--color-active)" },
  { status: "inactive", count: 7, fill: "var(--color-inactive)" },
  { status: "suspended", count: 4, fill: "var(--color-suspended)" },
]

export const userStatusDistributionConfig = {
  active: {
    label: "Aktif",
    color: "var(--chart-1)",
  },
  inactive: {
    label: "Nonaktif",
    color: "var(--chart-2)",
  },
  suspended: {
    label: "Ditangguhkan",
    color: "var(--chart-3)",
  },
} satisfies ChartConfig
