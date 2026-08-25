# Data Fetching — TanStack Query v5

## Setup

- `src/lib/query-client.ts` — factory `makeQueryClient()`.
- `app/providers.tsx` membuat instance lewat `useState(() => makeQueryClient())`
  (pola resmi TanStack Query untuk aplikasi full client-side/SPA).
- Default: `staleTime: 30s`, `refetchOnWindowFocus: false`, `retry: 1`.

## Query Keys

Didefinisikan sebagai objek hierarki (`features/users/api/users.queries.ts`):

```ts
usersKeys.all        // ['users']              → invalidate semua users
usersKeys.lists()    // ['users', 'list']      → invalidate semua list
usersKeys.list(p)    // ['users', 'list', p]   → cache per kombinasi params
```

**Aturan**: selalu invalidate pada level paling tinggi yang masuk akal. Mutasi CRUD memanggil `invalidateQueries({ queryKey: usersKeys.lists() })` sehingga SEMUA kombinasi filter yang sedang ter-cache ikut segar.

## Options Factory

Pola rekomendasi v5 — satukan `queryKey` + `queryFn` dalam satu fungsi:

```ts
export const usersQueries = {
  list: (params: UsersListParams) =>
    queryOptions({
      queryKey: usersKeys.list(params),
      queryFn: () => fetchUsersList(params),
      placeholderData: keepPreviousData, // ← kunci UX pagination mulus
    }),
}
```

Konsumsi: `useQuery(usersQueries.list(params))`. Keuntungan: type-safe end-to-end dan siap dipakai ulang (mis. `queryClient.prefetchQuery(...)`) bila kelak butuh SSR/prefetch.

## Pagination UX

- `placeholderData: keepPreviousData` → saat ganti halaman/filter, data lama tetap tampil sampai data baru datang (baris diredupkan via prop `isRefreshing` di `<DataTable>`).
- Skeleton hanya muncul saat `query.isPending` (fetch pertama).

## Mutations

Satu hook per aksi (`hooks/use-create-user.ts` dst.):

```ts
useMutation({
  mutationFn: (payload) => fetchCreateUser(payload),
  onSuccess: async (user) => {
    toast.success(...)
    await queryClient.invalidateQueries({ queryKey: usersKeys.lists() })
  },
  onError: (error) => toast.error(...), // ApiError.message dari server
})
```

Komponen memanggil `mutateAsync` dan cukup `try/catch` untuk menahan dialog tetap terbuka saat gagal — toast sudah ditangani hook.

## Ganti ke Data Nyata

Tidak ada perubahan di hooks/komponen — cukup ubah base URL/fungsi fetch di `features/*/api/*.api.ts`. Lihat [mock-api.md](./mock-api.md).
