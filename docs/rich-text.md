# Rich Text (Tiptap v3)

Template memakai [Tiptap](https://tiptap.dev) v3 sebagai editor rich text,
dengan penyimpanan konten dalam format **JSON Tiptap** dan tampilan ulang
via **static-renderer**.

## Arsitektur

```
┌─────────────────────────────┐        ┌──────────────────────────────┐
│  RichTextEditor             │ simpan │  Database/Mock               │
│  (useEditor + toolbar)      │──JSON──│  content: string(JSON)       │
└─────────────────────────────┘        └──────────────┬───────────────┘
                                                      │ baca
                              ┌───────────────────────▼───────────────┐
                              │  RichTextView                          │
                              │  renderToHTMLString() → <div.prose>    │
                              └────────────────────────────────────────┘
```

Semua komponen ada di `src/components/rich-text-editor/` (global, reusable):

| File | Peran |
| --- | --- |
| `editor-extensions.ts` | `createRichTextExtensions()` — daftar ekstensi TUNGGAL untuk editor & renderer (StarterKit v3 + Placeholder). Wajib sama agar render konsisten |
| `rich-text-editor.tsx` | Editor terkontrol: props `value`(string JSON)/`onChange`; `immediatelyRender: false` (wajib Next.js); toolbar pakai `useEditorState` |
| `editor-toolbar-button.tsx` | Tombol toolbar generik (Button ghost + `aria-pressed`) |
| `rich-text-view.tsx` | Display: `renderToHTMLString()` dari `@tiptap/static-renderer/pm/html-string` → container `.prose` |
| `rich-text-utils.ts` | `parseTiptapDoc()`, `isTiptapDocEmpty()` (validasi form) |

## Pemakaian di Form (React Hook Form)

```tsx
<Controller
  name="content"
  control={form.control}
  render={({ field, fieldState }) => (
    <Field data-invalid={fieldState.invalid || undefined}>
      <FieldLabel>Konten</FieldLabel>
      <RichTextEditor
        value={field.value}
        onChange={field.onChange}
        placeholder="Tulis konten…"
      />
      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
    </Field>
  )}
/>
```

Validasi Zod (lihat `features/posts/schemas/post.schema.ts`):

```ts
export const postContentSchema = z.string().refine(
  (value) => !isTiptapDocEmpty(value),
  { message: "Konten artikel wajib diisi." },
)
```

## Menampilkan Konten

```tsx
import { RichTextView } from "@/components/rich-text-editor"

<RichTextView content={post.content} />
```

Di balik layar: JSON → `renderToHTMLString({ extensions, content })`
(fungsi murni, tanpa DOM/editor instance) → HTML string → container
`.prose prose-sm dark:prose-invert` dari `@tailwindcss/typography`.

## Keputusan & Catatan Penting

1. **Format JSON** dipilih (bukan HTML string) karena format asli Tiptap:
   portable, aman dari manipulasi tag, mudah diperiksa strukturnya.
2. **`immediatelyRender: false`** wajib — tanpa ini editor dirender saat
   prerender statis dan menyebabkan hydration mismatch (docs resmi Tiptap).
3. **Ekstensi tunggal**: menambah extension baru (mis. `@tiptap/extension-image`)
   cukup tambahkan di `createRichTextExtensions()` — editor & view otomatis ikut.
4. **Sanitasi**: konten yang dirender berasal dari editor sendiri sehingga
   aman. Bila kelak menerima JSON dari sumber tak terpercaya, sanitasi
   output HTML dengan DOMPurify sebelum injeksi.
5. **nodeLinker hoisted** (`pnpm-workspace.yaml`) — resolusi Turbopack pada
   paket ber-symlink pnpm pernah bermasalah (@tiptap/*, @hookform/resolvers);
   layout hoisted (ala npm) menyelesaikannya secara permanen.

## Contoh Pemakaian Nyata

Lihat fitur `posts`: create/edit memakai **halaman penuh** (`/posts/new`
dan `/posts/edit?id=...` — bukan dialog, agar nyaman menulis konten
panjang dan tahan refresh), sedangkan membaca memakai dialog baca.
Alur data mengikuti pola users di [`features.md`](./features.md).
