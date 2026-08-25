/**
 * Public API modul rich text (Tiptap) — reusable lintas fitur.
 */
export { RichTextEditor } from "./rich-text-editor"
export { RichTextView } from "./rich-text-view"
export { EditorToolbarButton } from "./editor-toolbar-button"
export {
  createRichTextExtensions,
  DEFAULT_RICH_TEXT_PLACEHOLDER,
} from "./editor-extensions"
export { isTiptapDocEmpty, parseTiptapDoc } from "./rich-text-utils"
