"use client"

import { useEffect, useMemo } from "react"
import { EditorContent, useEditor, useEditorState } from "@tiptap/react"
import type { Editor } from "@tiptap/react"
import {
  BoldIcon,
  CodeIcon,
  Heading2Icon,
  Heading3Icon,
  ItalicIcon,
  Link2OffIcon,
  Link2Icon,
  ListIcon,
  ListOrderedIcon,
  QuoteIcon,
  Redo2Icon,
  StrikethroughIcon,
  Undo2Icon,
} from "lucide-react"

import { cn } from "@/lib/utils"

import { createRichTextExtensions } from "./editor-extensions"
import { EditorToolbarButton } from "./editor-toolbar-button"
import { parseTiptapDoc } from "./rich-text-utils"

interface RichTextEditorProps {
  /** Konten sebagai string JSON Tiptap (terkontrol penuh oleh pemanggil). */
  value: string
  onChange: (jsonString: string) => void
  placeholder?: string
  disabled?: boolean
  className?: string
}

function setLink(editor: Editor) {
  const url = window.prompt("Masukkan URL tautan:", "https://")

  if (url === null) return
  if (url.trim() === "") {
    editor.chain().focus().extendMarkRange("link").unsetLink().run()
    return
  }

  editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run()
}

/**
 * Rich text editor berbasis Tiptap v3 dengan toolbar shadcn.
 * - `immediatelyRender: false` wajib untuk prerender Next.js (docs resmi).
 * - State toolbar lewat `useEditorState` agar hanya tombol yang re-render.
 */
export function RichTextEditor({
  value,
  onChange,
  placeholder,
  disabled = false,
  className,
}: RichTextEditorProps) {
  const initialContent = useMemo(() => parseTiptapDoc(value), []) // eslint-disable-line react-hooks/exhaustive-deps

  const editor = useEditor({
    extensions: createRichTextExtensions(placeholder),
    content: initialContent ?? undefined,
    immediatelyRender: false,
    editable: !disabled,
    onUpdate: ({ editor: current }) => {
      onChange(JSON.stringify(current.getJSON()))
    },
  })

  useEffect(() => {
    editor?.setEditable(!disabled)
  }, [disabled, editor])

  const toolbar = useEditorState({
    editor,
    selector: ({ editor: current }) => {
      if (!current) return null

      return {
        canUndo: current.can().undo(),
        canRedo: current.can().redo(),
        isBold: current.isActive("bold"),
        isItalic: current.isActive("italic"),
        isUnderline: current.isActive("underline"),
        isStrike: current.isActive("strike"),
        isCode: current.isActive("code"),
        isH2: current.isActive("heading", { level: 2 }),
        isH3: current.isActive("heading", { level: 3 }),
        isBulletList: current.isActive("bulletList"),
        isOrderedList: current.isActive("orderedList"),
        isBlockquote: current.isActive("blockquote"),
        isCodeBlock: current.isActive("codeBlock"),
        isLink: current.isActive("link"),
      }
    },
  })

  const chain = () => editor!.chain().focus()

  return (
    <div
      className={cn(
        "overflow-hidden rounded-lg border bg-transparent",
        disabled && "opacity-60",
        className,
      )}
    >
      <div className="flex flex-wrap items-center gap-0.5 border-b bg-muted/40 px-1.5 py-1">
        <EditorToolbarButton
          label="Urungkan"
          disabled={!toolbar?.canUndo}
          onClick={() => chain().undo().run()}
        >
          <Undo2Icon />
        </EditorToolbarButton>
        <EditorToolbarButton
          label="Ulangi"
          disabled={!toolbar?.canRedo}
          onClick={() => chain().redo().run()}
        >
          <Redo2Icon />
        </EditorToolbarButton>

        <span className="mx-1 h-5 w-px bg-border" aria-hidden="true" />

        <EditorToolbarButton
          label="Tebal"
          isActive={toolbar?.isBold}
          onClick={() => chain().toggleBold().run()}
        >
          <BoldIcon />
        </EditorToolbarButton>
        <EditorToolbarButton
          label="Miring"
          isActive={toolbar?.isItalic}
          onClick={() => chain().toggleItalic().run()}
        >
          <ItalicIcon />
        </EditorToolbarButton>
        <EditorToolbarButton
          label="Garis bawah"
          isActive={toolbar?.isUnderline}
          onClick={() => chain().toggleUnderline().run()}
        >
          <span className="text-sm font-medium underline underline-offset-2">U</span>
        </EditorToolbarButton>
        <EditorToolbarButton
          label="Coret"
          isActive={toolbar?.isStrike}
          onClick={() => chain().toggleStrike().run()}
        >
          <StrikethroughIcon />
        </EditorToolbarButton>
        <EditorToolbarButton
          label="Kode inline"
          isActive={toolbar?.isCode}
          onClick={() => chain().toggleCode().run()}
        >
          <CodeIcon />
        </EditorToolbarButton>

        <span className="mx-1 h-5 w-px bg-border" aria-hidden="true" />

        <EditorToolbarButton
          label="Judul 2"
          isActive={toolbar?.isH2}
          onClick={() => chain().toggleHeading({ level: 2 }).run()}
        >
          <Heading2Icon />
        </EditorToolbarButton>
        <EditorToolbarButton
          label="Judul 3"
          isActive={toolbar?.isH3}
          onClick={() => chain().toggleHeading({ level: 3 }).run()}
        >
          <Heading3Icon />
        </EditorToolbarButton>

        <span className="mx-1 h-5 w-px bg-border" aria-hidden="true" />

        <EditorToolbarButton
          label="Daftar poin"
          isActive={toolbar?.isBulletList}
          onClick={() => chain().toggleBulletList().run()}
        >
          <ListIcon />
        </EditorToolbarButton>
        <EditorToolbarButton
          label="Daftar bernomor"
          isActive={toolbar?.isOrderedList}
          onClick={() => chain().toggleOrderedList().run()}
        >
          <ListOrderedIcon />
        </EditorToolbarButton>
        <EditorToolbarButton
          label="Kutipan"
          isActive={toolbar?.isBlockquote}
          onClick={() => chain().toggleBlockquote().run()}
        >
          <QuoteIcon />
        </EditorToolbarButton>

        <span className="mx-1 h-5 w-px bg-border" aria-hidden="true" />

        <EditorToolbarButton
          label="Tautan"
          isActive={toolbar?.isLink}
          onClick={() => editor && setLink(editor)}
        >
          {toolbar?.isLink ? <Link2OffIcon /> : <Link2Icon />}
        </EditorToolbarButton>
      </div>

      <div className="prose prose-sm dark:prose-invert max-w-none px-3 py-2">
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}
