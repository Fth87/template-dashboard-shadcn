"use client"

import { useMemo } from "react"
import { renderToHTMLString } from "@tiptap/static-renderer/pm/html-string"

import {
  createRichTextExtensions,
} from "./editor-extensions"
import { isTiptapDocEmpty, parseTiptapDoc } from "./rich-text-utils"

interface RichTextViewProps {
  /** Konten sebagai string JSON Tiptap. */
  content: string
  className?: string
}

/**
 * Cara menampilkan konten Tiptap tanpa instance editor:
 * JSON → HTML string via `renderToHTMLString` (static-renderer),
 * lalu dirender ke dalam container `prose` (tailwind typography).
 *
 * Ekstensi yang dipakai HARUS sama dengan editor (lihat editor-extensions.ts).
 */
export function RichTextView({ content, className }: RichTextViewProps) {
  const html = useMemo(() => {
    const doc = parseTiptapDoc(content)

    if (!doc || isTiptapDocEmpty(content)) return null

    return renderToHTMLString({
      extensions: createRichTextExtensions(),
      content: doc,
    })
  }, [content])

  if (!html) {
    return (
      <p className={className ?? "text-sm text-muted-foreground"}>
        (tidak ada konten)
      </p>
    )
  }

  // Konten dihasilkan dari JSON milik editor sendiri (bukan input tak terpercaya).
  // Untuk konten publik dari pihak ketiga, sanitasi dulu dengan DOMPurify.
  return (
    <div
      className={
        className ??
        "prose prose-sm dark:prose-invert max-w-none break-words"
      }
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
