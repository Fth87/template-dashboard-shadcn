import Placeholder from "@tiptap/extension-placeholder"
import StarterKit from "@tiptap/starter-kit"
import type { Extension } from "@tiptap/react"

/**
 * Daftar ekstensi editor yang dipakai BERSAMA oleh:
 * - `RichTextEditor` (saat menulis)
 * - `RichTextView` via static-renderer (saat membaca)
 *
 * Keduanya HARUS memakai daftar yang sama agar konten JSON selalu
 * bisa dirender dengan hasil yang konsisten.
 * Catatan: StarterKit v3 sudah mencakup Link & Underline.
 */
export const DEFAULT_RICH_TEXT_PLACEHOLDER = "Tulis sesuatu…"

export function createRichTextExtensions(
  placeholder: string = DEFAULT_RICH_TEXT_PLACEHOLDER,
): Extension[] {
  return [
    StarterKit,
    Placeholder.configure({ placeholder }),
  ]
}
