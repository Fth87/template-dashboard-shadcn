import { useForm } from "react-hook-form"

import { zodResolver } from "@/lib/zod-resolver"

import { createUserSchema } from "../schemas/user.schema"
import type { User, UserFormValues } from "../types/user.types"

const EMPTY_FORM_VALUES: UserFormValues = {
  name: "",
  email: "",
  role: "viewer",
  status: "active",
}

function getInitialValues(user: User | null | undefined): UserFormValues {
  if (!user) return EMPTY_FORM_VALUES

  return {
    name: user.name,
    email: user.email,
    role: user.role,
    status: user.status,
  }
}

interface UseUserFormOptions {
  /** Terisi saat mode edit; kosong (null/undefined) berarti mode create. */
  user?: User | null
  onSubmit: (values: UserFormValues) => Promise<unknown>
  onSuccess: () => void
}

/**
 * Logika form create/edit user (React Hook Form + zod).
 * Dipisah dari UI agar komponen dialog tetap presentasional.
 */
export function useUserForm({ user, onSubmit, onSuccess }: UseUserFormOptions) {
  const form = useForm<UserFormValues>({
    resolver: zodResolver(createUserSchema),
    defaultValues: getInitialValues(user),
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
