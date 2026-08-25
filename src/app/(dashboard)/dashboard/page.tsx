import type { Metadata } from "next"

import { DashboardPage } from "@/features/dashboard"

export const metadata: Metadata = {
  title: "Dashboard",
}

/**
 * Routing saja — seluruh logika ada di feature `dashboard` (client-side).
 */
export default function DashboardRoute() {
  return <DashboardPage />
}
