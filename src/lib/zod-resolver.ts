import type {
  FieldErrors,
  FieldValues,
  FieldError as RhfFieldError,
  Resolver,
} from "react-hook-form"
import type { ZodType } from "zod"

/**
 * Resolver React Hook Form berbasis skema Zod.
 *
 * Ditulis sendiri (alih-alih memakai `@hookform/resolvers`) agar
 * dependensi minimal dan bebas dari masalah resolusi bundler.
 * Mendukung path bertingkat (cth. `emails.0.address`) dari
 * `issue.path` milik Zod.
 */

interface ResolvedIssue {
  path: PropertyKey[]
  message: string
}

interface InternalResolverResult<TValues extends FieldValues> {
  values: TValues
  errors: FieldErrors
}

function setDeepError(
  errors: FieldErrors,
  segments: string[],
  message: string,
): void {
  let cursor = errors as Record<string, unknown>

  for (let i = 0; i < segments.length - 1; i++) {
    const key = segments[i]
    if (typeof cursor[key] !== "object" || cursor[key] === null) {
      cursor[key] = {}
    }
    cursor = cursor[key] as Record<string, unknown>
  }

  const lastKey = segments[segments.length - 1]
  cursor[lastKey] = {
    type: "validation",
    message,
  } as RhfFieldError
}

function toFieldErrors(issues: readonly ResolvedIssue[]): FieldErrors {
  const errors: FieldErrors = {}

  for (const issue of issues) {
    const segments = issue.path.map(String)

    if (segments.length === 0) {
      // Error level akar (mis. refine lintas-field).
      errors.root = {
        type: "validation",
        message: issue.message,
      } as RhfFieldError
      continue
    }

    setDeepError(errors, segments, issue.message)
  }

  return errors
}

export function zodResolver<TValues extends FieldValues>(
  schema: ZodType<TValues>,
): Resolver<TValues> {
  async function resolve(
    rawValues: TValues,
  ): Promise<InternalResolverResult<TValues>> {
    const result = schema.safeParse(rawValues)

    // Kirim hasil parse agar transformasi Zod (trim, dll.) ikut tersimpan.
    if (result.success) {
      return { values: result.data, errors: {} }
    }

    return { values: {} as TValues, errors: toFieldErrors(result.error.issues) }
  }

  // Satu-satunya cast: kontrak internal vs generik milik RHF.
  return resolve as unknown as Resolver<TValues>
}
