import { useForm } from "react-hook-form"

import { zodResolver } from "@/lib/zod-resolver"

import { createPostSchema } from "../schemas/post.schema"
import type { Post, PostFormValues } from "../types/post.types"

const EMPTY_FORM_VALUES: PostFormValues = {
  title: "",
  status: "draft",
  content: "",
}

function getInitialValues(post: Post | null | undefined): PostFormValues {
  if (!post) return EMPTY_FORM_VALUES

  return {
    title: post.title,
    status: post.status,
    content: post.content,
  }
}

interface UsePostFormOptions {
  /** Terisi saat mode edit; kosong (null/undefined) berarti mode create. */
  post?: Post | null
  onSubmit: (values: PostFormValues) => Promise<unknown>
  onSuccess: () => void
}

/**
 * Logika form create/edit artikel (React Hook Form + Zod).
 * Field konten memakai string JSON Tiptap yang divalidasi skema.
 */
export function usePostForm({ post, onSubmit, onSuccess }: UsePostFormOptions) {
  const form = useForm<PostFormValues>({
    resolver: zodResolver(createPostSchema),
    defaultValues: getInitialValues(post),
  })

  const handleSubmit = form.handleSubmit(async (values) => {
    // Error sudah ditampilkan sebagai toast oleh hook mutation,
    // jadi cukup cegah dialog tertutup saat gagal.
    try {
      await onSubmit(values)
      onSuccess()
    } catch {
      // Sudah ditangani di mutation.
    }
  })

  return {
    form,
    handleSubmit,
    isSubmitting: form.formState.isSubmitting,
  }
}
