/**
 * Konfigurasi pagination bersifat global agar konsisten di semua tabel.
 */
export const PAGE_SIZE_OPTIONS = [10, 20, 30, 40, 50] as const

export const DEFAULT_PAGE_SIZE = 10 satisfies (typeof PAGE_SIZE_OPTIONS)[number]
