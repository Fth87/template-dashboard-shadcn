# Form & Validasi — React Hook Form + Zod

## Prinsip

**Satu skema Zod, dua pemakaian:**

```
schemas/user.schema.ts
   ├── client: zodResolver(createUserSchema) → validasi form (use-user-form.ts)
   └── server: createUserSchema.safeParse(body) → validasi POST /api/users
```

Aturan validasi tidak pernah ditulis dua kali.

## Struktur

| File | Tanggung jawab |
| --- | --- |
| `features/users/schemas/user.schema.ts` | `createUserSchema`, `updateUserSchema`, `usersListQuerySchema` |
| `features/users/hooks/use-user-form.ts` | `useForm` + resolver + `handleSubmit`; menerima `user` (mode edit) atau `null` (mode create) |
| `components/user-form-dialog.tsx` | UI dialog; render field via `<Controller>` + komponen `<Field>` shadcn |
| `lib/zod-resolver.ts` | Jembatan RHF ← Zod (`safeParse` + mapping `issues[].path` → `FieldErrors`) |

## Pola Field (shadcn/ui Base UI)

```tsx
<Controller
  name="email"
  control={form.control}
  render={({ field, fieldState }) => (
    <Field data-invalid={fieldState.invalid || undefined}>
      <FieldLabel htmlFor="user-email">Email</FieldLabel>
      <Input {...field} id="user-email" aria-invalid={fieldState.invalid || undefined} />
      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
    </Field>
  )}
/>
```

- Input teks: spread `{...field}` langsung.
- Select: `value={field.value}` + `onValueChange={(v) => field.onChange(v as UserRole)}`.
- Aksesibilitas: `data-invalid` pada `<Field>`, `aria-invalid` pada kontrol.

## Create vs Edit

Satu dialog untuk dua mode:

```tsx
<UserFormDialog open onOpenChange />            // create
<UserFormDialog user={row.original} ... />      // edit
```

`defaultValues` dihitung dari prop `user` saat mount. Komponen pemanggil me-render dialog secara **kondisional** (lihat `users-table-row-actions.tsx`) agar form selalu fresh setiap dibuka tanpa perlu `form.reset()` manual.

## Resolver Buatan Sendiri

Kami memakai `lib/zod-resolver.ts` (~60 baris) alih-alih paket `@hookform/resolvers`:

- Menghilangkan satu dependensi & masalah resolusi bundler yang pernah terjadi.
- Cukup `schema.safeParse(values)` lalu petakan `issues[].path` (mendukung path bertingkat seperti `emails.0.address`).
- Hasil parse sukses dikembalikan sebagai `values` sehingga transformasi Zod (`.trim()` dst.) ikut tersimpan.

## Validasi Bersama

Template berjalan client-side, jadi validasi form berjalan di browser.
Yang penting: **skema tidak pernah ditulis dua kali** — file yang sama
menjadi kontrak data:

```ts
// schemas/user.schema.ts
export const createUserSchema = z.object({ ... })
```

- Client: `zodResolver(createUserSchema)` pada form (dan mock store
  meniru aturan error server, mis. email duplikat → pesan sama).
- Saat backend nyata ada: jalankan `createUserSchema.safeParse(body)`
  di server dan kembalikan `{ message }` dari issue pertama —
  toast client sudah siap menampilkannya:

```ts
const parsed = createUserSchema.safeParse(await request.json())
if (!parsed.success) {
  return NextResponse.json(
    { message: parsed.error.issues[0]?.message ?? "Data tidak valid." },
    { status: 400 },
  )
}
```
