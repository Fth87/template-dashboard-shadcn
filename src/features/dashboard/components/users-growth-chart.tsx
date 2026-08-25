"use client"

import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

import {
  MONTHLY_USER_GROWTH,
  monthlyUserGrowthConfig,
} from "../constants/dashboard.constants"

/**
 * Area chart "Registrasi pengguna" — pola resmi shadcn/ui:
 * Recharts murni di dalam ChartContainer + tooltip kustom.
 */
export function UsersGrowthChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Registrasi Pengguna</CardTitle>
        <CardDescription>Pengguna baru dalam 12 bulan terakhir</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={monthlyUserGrowthConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart
            accessibilityLayer
            data={MONTHLY_USER_GROWTH}
            margin={{ left: 12, right: 12 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value: string) => value.slice(0, 3)}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Area
              dataKey="users"
              type="natural"
              fill="var(--color-users)"
              fillOpacity={0.4}
              stroke="var(--color-users)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
