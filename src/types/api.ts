export interface PaginationMeta {
  page: number
  perPage: number
  totalItems: number
  totalPages: number
}

export interface PaginatedResponse<TData> {
  items: TData[]
  meta: PaginationMeta
}
