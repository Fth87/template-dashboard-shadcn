"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Controller } from "react-hook-form"
import { ArrowLeftIcon, Loader2Icon } from "lucide-react"

import { PageHeader } from "@/components/page-header"
import { RichTextEditor } from "@/components/rich-text-editor"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { POST_STATUS_OPTIONS } from "../constants/post.constants"
import { useCreatePost } from "../hooks/use-create-post"
import { useUpdatePost } from "../hooks/use-update-post"
import { usePostForm } from "../hooks/use-post-form"
import type { Post, PostStatus } from "../types/post.types"

const statusItems: Record<string, string> = Object.fromEntries(
  POST_STATUS_OPTIONS.map((option) => [option.value, option.label]),
)

interface PostFormProps {
  /** Terisi berarti mode edit; null berarti mode tambah. */
  post?: Post | null
}

/**
 * Form create/edit artikel dalam halaman penuh (bukan dialog)
 * agar menulis konten panjang nyaman dan tidak hilang jika
 * pengguna tidak sengaja menutup overlay.
 */
export function PostForm({ post = null }: PostFormProps) {
  const router = useRouter()
  const isEditMode = Boolean(post)
  // Kedua hook dipanggil tanpa syarat (aturan React Hooks);
  // yang tidak aktif hanya idle dan tidak pernah dieksekusi.
  const createMutation = useCreatePost()
  const updateMutation = useUpdatePost()

  function handleSuccess() {
    // Kembali ke daftar; list otomatis fresh lewat invalidasi mutation.
    router.push("/posts")
  }

  const { form, handleSubmit, isSubmitting } = usePostForm({
    post,
    onSubmit: (values) =>
      isEditMode
        ? updateMutation.mutateAsync({ id: post!.id, payload: values })
        : createMutation.mutateAsync(values),
    onSuccess: handleSuccess,
  })

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
      <PageHeader
        title={isEditMode ? "Edit Artikel" : "Tambah Artikel"}
        description={
          isEditMode
            ? "Perbarui isi artikel lalu simpan."
            : "Tulis artikel baru menggunakan editor rich text."
        }
      >
        {/* Link ber-tampilan button (best practice shadcn Base UI). */}
        <Link href="/posts" className={buttonVariants({ variant: "outline" })}>
          <ArrowLeftIcon data-icon="inline-start" />
          Kembali
        </Link>
      </PageHeader>

      <form onSubmit={handleSubmit} noValidate>
        <Card>
          <CardContent>
            <FieldGroup>
              <Controller
                name="title"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid || undefined}>
                    <FieldLabel htmlFor="post-title">Judul</FieldLabel>
                    <Input
                      {...field}
                      id="post-title"
                      aria-invalid={fieldState.invalid || undefined}
                      placeholder="cth. Panduan Memulai Dashboard"
                      autoComplete="off"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="status"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid || undefined}>
                    <FieldLabel htmlFor="post-status">Status</FieldLabel>
                    <Select
                      items={statusItems}
                      value={field.value}
                      onValueChange={(value) =>
                        field.onChange(value as PostStatus)
                      }
                    >
                      <SelectTrigger id="post-status" className="w-full sm:w-44">
                        <SelectValue placeholder="Pilih status" />
                      </SelectTrigger>
                      <SelectContent>
                        {POST_STATUS_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="content"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid || undefined}>
                    <FieldLabel>Konten</FieldLabel>
                    <RichTextEditor
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Tulis konten artikel di sini…"
                      aria-invalid={fieldState.invalid || undefined}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>
          </CardContent>

          <CardFooter className="justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/posts")}
              disabled={isSubmitting}
            >
              Batal
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? <Loader2Icon className="animate-spin" /> : null}
              Simpan
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  )
}
