"use client"

import { useState } from "react"

import { QueryClientProvider } from "@tanstack/react-query"
import { NuqsAdapter } from "nuqs/adapters/next/app"

import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { makeQueryClient } from "@/lib/query-client"

/**
 * Semua provider client-side aplikasi dipasang di satu tempat.
 * File app lain tetap bisa berupa Server Component.
 */
export function Providers({ children }: { children: React.ReactNode }) {
  // Pola resmi TanStack Query untuk SPA: satu instance per mount browser.
  const [queryClient] = useState(() => makeQueryClient())

  return (
    <NuqsAdapter>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {/* Dibutuhkan komponen yang memakai tooltip (mis. Sidebar collapsed). */}
          <TooltipProvider>{children}</TooltipProvider>
          <Toaster position="bottom-right" richColors closeButton />
        </ThemeProvider>
      </QueryClientProvider>
    </NuqsAdapter>
  )
}
