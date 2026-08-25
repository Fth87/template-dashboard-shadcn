import { redirect } from "next/navigation"

/** Root hanya meneruskan ke halaman utama dashboard. */
export default function Home() {
  redirect("/dashboard")
}
