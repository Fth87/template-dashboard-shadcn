"use client"

import { Pie, PieChart } from "recharts"

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

import {
  USER_STATUS_DISTRIBUTION,
  userStatusDistributionConfig,
} from "../constants/dashboard.constants"

/**
 * Donut chart "Distribusi status" — pola resmi shadcn/ui:
 * warna tiap irisan lewat `fill` di data (`var(--color-KEY)`),
 * label/legend dari chart config.
 */
export function UserStatusChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Distribusi Status</CardTitle>
        <CardDescription>Perbandingan status seluruh pengguna</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={userStatusDistributionConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={USER_STATUS_DISTRIBUTION}
              dataKey="count"
              nameKey="status"
              innerRadius={60}
              strokeWidth={5}
            />
            <ChartLegend
              content={<ChartLegendContent nameKey="status" />}
              className="flex-wrap gap-2 *:basis-1/4 *:justify-center"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
