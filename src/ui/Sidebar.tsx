"use client"
import { useRouter, usePathname } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import { useTheme } from "@/context/ThemeContext"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSub,
  DropdownMenuSubTrigger, DropdownMenuSubContent, DropdownMenuSeparator, DropdownMenuTrigger
} from "@/ui/dropdown-menu"
import { MemberAvatar } from "@/ui/MemberAvatar"
import { ChevronsUpDown, ChevronDown, LayoutGrid, FolderOpen, Sun, Moon, Settings, LogOut } from "lucide-react"
import { cn } from "@/lib/utils"
import type { ColorMode } from "@/types"

interface SidebarProps {
  collapsed: boolean
}

const COLOR_OPTIONS: { value: ColorMode; label: string; bg: string }[] = [
  { value: "amber",   label: "Amber",   bg: "bg-amber-500" },
  { value: "blue",    label: "Blue",    bg: "bg-blue-500" },
  { value: "pink",    label: "Pink",    bg: "bg-pink-500" },
  { value: "rose",    label: "Rose",    bg: "bg-rose-500" },
  { value: "emerald", label: "Emerald", bg: "bg-emerald-500" },
  { value: "black",   label: "Black",   bg: "bg-gray-900" },
]

export function Sidebar({ collapsed }: SidebarProps) {
  const { user, logout } = useAuth()
  const { theme, colorMode, setTheme, setColorMode } = useTheme()
  const router = useRouter()
  const pathname = usePathname()

  const navItems = [
    { href: "/tasks",    label: "Tasks",    icon: <LayoutGrid className="h-4 w-4" /> },
    { href: "/projects", label: "Projects", icon: <FolderOpen className="h-4 w-4" /> },
  ]

  if (collapsed) return null

  return (
    <aside className="w-60 shrink-0 border-r border-border bg-background flex flex-col h-full">
      {/* User section */}
      <div className="p-3 border-b border-border">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2.5 w-full px-2 py-2 rounded-lg hover:bg-muted transition-colors">
              <MemberAvatar member={user || undefined} size="md" />
              <div className="flex-1 min-w-0 text-left">
                <p className="text-sm font-semibold text-foreground truncate">{user?.name || "Guest"}</p>
              </div>
              <ChevronsUpDown className="h-4 w-4 text-muted-foreground shrink-0" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="start">
            {/* Profile info */}
            <div className="px-3 py-3 flex flex-col items-center gap-2 border-b border-border">
              <MemberAvatar member={user || undefined} size="lg" />
              <div className="text-center">
                <p className="text-sm font-semibold">{user?.name}</p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
              </div>
            </div>
            {/* Change Theme submenu */}
            <DropdownMenuSub>
              <DropdownMenuSubTrigger className="gap-2">
                <Sun className="h-4 w-4" /> Change Theme
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <div className="px-2 py-1 text-xs font-semibold text-muted-foreground">Theme</div>
                <DropdownMenuItem onClick={() => setTheme("light")}>
                  <Sun className="h-4 w-4" /> Light {theme === "light" && "✓"}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")}>
                  <Moon className="h-4 w-4" /> Dark {theme === "dark" && "✓"}
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
            {/* Color Mode submenu */}
            <DropdownMenuSub>
              <DropdownMenuSubTrigger className="gap-2">
                <div className={cn("h-3.5 w-3.5 rounded", COLOR_OPTIONS.find(c => c.value === colorMode)?.bg || "bg-blue-500")} />
                Color Mode
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <div className="px-2 py-1 text-xs font-semibold text-muted-foreground">Color Mode</div>
                {COLOR_OPTIONS.map((c) => (
                  <DropdownMenuItem key={c.value} onClick={() => setColorMode(c.value)}>
                    <div className={cn("h-3.5 w-3.5 rounded", c.bg)} /> {c.label}
                    {colorMode === c.value && " ✓"}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuSubContent>
            </DropdownMenuSub>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push("/settings")}>
              <Settings className="h-4 w-4" /> Settings
            </DropdownMenuItem>
            <DropdownMenuItem onClick={logout} className="text-red-500">
              <LogOut className="h-4 w-4" /> Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Workspace nav */}
      <div className="p-3 flex-1">
        <div className="flex items-center justify-between px-2 py-1.5 mb-1">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Workspace</span>
          <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
        </div>
        <nav className="space-y-0.5">
          {navItems.map(({ href, label, icon }) => (
            <button
              key={href}
              onClick={() => router.push(href)}
              className={cn(
                "flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-sm transition-colors",
                pathname.startsWith(href)
                  ? "bg-muted font-semibold text-foreground"
                  : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
              )}
            >
              {icon}
              {label}
            </button>
          ))}
        </nav>
      </div>
    </aside>
  )
}
