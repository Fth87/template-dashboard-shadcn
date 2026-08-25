import {
  FileTextIcon,
  LayoutDashboardIcon,
  UsersIcon,
  type LucideIcon,
} from "lucide-react"

export interface NavItem {
  href: string
  label: string
  icon: LucideIcon
}

export const mainNav: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboardIcon },
  { href: "/users", label: "Pengguna", icon: UsersIcon },
  { href: "/posts", label: "Artikel", icon: FileTextIcon },
]
