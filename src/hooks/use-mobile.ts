import * as React from "react"

const MOBILE_BREAKPOINT = 768
const MOBILE_MEDIA_QUERY = `(max-width: ${MOBILE_BREAKPOINT - 1}px)`

function subscribe(onChange: () => void): () => void {
  const mediaQueryList = window.matchMedia(MOBILE_MEDIA_QUERY)
  mediaQueryList.addEventListener("change", onChange)
  return () => mediaQueryList.removeEventListener("change", onChange)
}

/**
 * Hook resmi shadcn/ui untuk mendeteksi viewport mobile.
 * Memakai useSyncExternalStore agar bebas dari setState-di-effect
 * dan konsisten antara SSR (false) dan client.
 */
export function useIsMobile(): boolean {
  return React.useSyncExternalStore(
    subscribe,
    () => window.matchMedia(MOBILE_MEDIA_QUERY).matches,
    () => false,
  )
}
