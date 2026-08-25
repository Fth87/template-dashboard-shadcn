"use client"

import { Controller } from "react-hook-form"
import { Loader2Icon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
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

import { USER_ROLE_OPTIONS, USER_STATUS_OPTIONS } from "../constants/user.constants"
import { useCreateUser } from "../hooks/use-create-user"
import { useUpdateUser } from "../hooks/use-update-user"
import { useUserForm } from "../hooks/use-user-form"
import type { User, UserRole, UserStatus } from "../types/user.types"

interface UserFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Terisi berarti mode edit; null berarti mode tambah. */
  user?: User | null
}

const roleItems: Record<string, string> = Object.fromEntries(
  USER_ROLE_OPTIONS.map((option) => [option.value, option.label]),
)

const statusItems: Record<string, string> = Object.fromEntries(
  USER_STATUS_OPTIONS.map((option) => [option.value, option.label]),
)

export function UserFormDialog({
  open,
  onOpenChange,
  user = null,
}: UserFormDialogProps) {
  const isEditMode = Boolean(user)
  // Kedua hook dipanggil tanpa syarat sesuai aturan React Hooks;
  // yang tidak aktif hanya idle dan tidak pernah dieksekusi.
  const createMutation = useCreateUser()
  const updateMutation = useUpdateUser()

  const { form, handleSubmit, isSubmitting } = useUserForm({
    user,
    onSubmit: (values) =>
      isEditMode
        ? updateMutation.mutateAsync({ id: user!.id, payload: values })
        : createMutation.mutateAsync(values),
    onSuccess: () => onOpenChange(false),
  })

  function renderTextField(
    name: "name" | "email",
    label: string,
    inputProps: React.ComponentProps<"input">,
  ) {
    return (
      <Controller
        name={name}
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid || undefined}>
            <FieldLabel htmlFor={`user-${name}`}>{label}</FieldLabel>
            <Input
              {...field}
              id={`user-${name}`}
              aria-invalid={fieldState.invalid || undefined}
              autoComplete="off"
              {...inputProps}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? `Edit "${user?.name}"` : "Tambah Pengguna"}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Ubah data pengguna lalu simpan."
              : "Isi detail pengguna baru untuk menambahkannya."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} noValidate>
          <FieldGroup>
            {renderTextField("name", "Nama", {
              placeholder: "cth. Budi Santoso",
            })}

            {renderTextField("email", "Email", {
              type: "email",
              placeholder: "nama@example.com",
            })}

            <Controller
              name="role"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid || undefined}>
                  <FieldLabel htmlFor="user-role">Peran</FieldLabel>
                  <Select
                    items={roleItems}
                    value={field.value}
                    onValueChange={(value) => field.onChange(value as UserRole)}
                  >
                    <SelectTrigger id="user-role" className="w-full">
                      <SelectValue placeholder="Pilih peran" />
                    </SelectTrigger>
                    <SelectContent>
                      {USER_ROLE_OPTIONS.map((option) => (
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
              name="status"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid || undefined}>
                  <FieldLabel htmlFor="user-status">Status</FieldLabel>
                  <Select
                    items={statusItems}
                    value={field.value}
                    onValueChange={(value) =>
                      field.onChange(value as UserStatus)
                    }
                  >
                    <SelectTrigger id="user-status" className="w-full">
                      <SelectValue placeholder="Pilih status" />
                    </SelectTrigger>
                    <SelectContent>
                      {USER_STATUS_OPTIONS.map((option) => (
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
          </FieldGroup>

          <DialogFooter className="mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Batal
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? <Loader2Icon className="animate-spin" /> : null}
              Simpan
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
