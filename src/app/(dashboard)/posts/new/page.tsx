import type { Metadata } from "next"

import { PostForm } from "@/features/posts/components/post-form"

export const metadata: Metadata = {
  title: "Tambah Artikel",
}

/**
 * Halaman create artikel — full page, bukan dialog,
 * agar nyaman menulis konten panjang.
 */
export default function NewPostRoute() {
  return <PostForm />
}
