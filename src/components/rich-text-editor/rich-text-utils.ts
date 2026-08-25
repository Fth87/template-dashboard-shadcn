import type { JSONContent } from "@tiptap/react"

/**
 * Util kecil untuk bekerja dengan dokumen Tiptap (JSON).
 */

/** Parse string JSON dokumen Tiptap → objek, atau null bila rusak. */
export function parseTiptapDoc(content: string): JSONContent | null {
  try {
    const parsed = JSON.parse(content) as unknown

    if (
      parsed &&
      typeof parsed === "object" &&
      "type" in parsed &&
      (parsed as JSONContent).type === "doc"
    ) {
      return parsed as JSONContent
    }

    return null
  } catch {
    return null
  }
}

/** Kumpulkan seluruh teks dari tree dokumen (rekursif). */
function collectText(node: JSONContent): string {
  const own = typeof node.text === "string" ? node.text : ""

  return node.content?.reduce(
    (acc, child) => `${acc}${collectText(child)}`,
    own,
  ) ?? own
}

/** True bila dokumen kosong / hanya whitespace (untuk validasi form). */
export function isTiptapDocEmpty(content: string): boolean {
  const doc = parseTiptapDoc(content)

  if (!doc) return true

  return collectText(doc).trim().length === 0
}
