"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import { useTheme } from "@/context/ThemeContext"
import { Button } from "@/ui/button"
import { ArrowLeft, User, Sun, Palette, Check } from "lucide-react"
import { cn } from "@/lib/utils"
import type { ColorMode, Theme } from "@/types"
import { MemberAvatar } from "@/ui/MemberAvatar"

const COLOR_OPTIONS: { value: ColorMode; label: string; bg: string; hex: string }[] = [
  { value: "amber",   label: "Amber",   bg: "bg-amber-500",   hex: "#f59e0b" },
  { value: "blue",    label: "Blue",    bg: "bg-blue-500",    hex: "#3b82f6" },
  { value: "pink",    label: "Pink",    bg: "bg-pink-500",    hex: "#ec4899" },
  { value: "rose",    label: "Rose",    bg: "bg-rose-500",    hex: "#f43f5e" },
  { value: "emerald", label: "Emerald", bg: "bg-emerald-500", hex: "#10b981" },
  { value: "black",   label: "Black",   bg: "bg-gray-900",    hex: "#111827" },
]

type SettingTab = "profile" | "theme" | "color"

export default function SettingsPage() {
  const { user, logout } = useAuth()
  const { theme, colorMode, setTheme, setColorMode } = useTheme()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<SettingTab>("profile")
  const [fullName, setFullName] = useState(user?.name || "")
  const [title, setTitle] = useState("Designer")
  const [username, setUsername] = useState("Dexuser")
  const [saved, setSaved] = useState(false)

  useEffect(() => { if (user?.name) setFullName(user.name) }, [user])

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const tabs: { key: SettingTab; label: string; icon: React.ReactNode }[] = [
    { key: "profile", label: "Profile", icon: <User className="h-4 w-4" /> },
    { key: "theme",   label: "Theme",   icon: <Sun className="h-4 w-4" /> },
    { key: "color",   label: "Color",   icon: <Palette className="h-4 w-4" /> },
  ]

  return (
    <div className="min-h-screen bg-background flex">
      {/* Settings Sidebar */}
      <aside className="w-56 border-r border-border flex flex-col p-4 shrink-0">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6 px-2"
        >
          <ArrowLeft className="h-4 w-4" /> Back to app
        </button>

        <div className="relative mb-4">
          <input
            placeholder="Search"
            className="w-full bg-muted/60 rounded-lg px-3 py-2 text-sm outline-none placeholder:text-muted-foreground"
          />
        </div>

        <nav className="space-y-0.5">
          {tabs.map(({ key, label, icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={cn(
                "flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-sm transition-colors",
                activeTab === key
                  ? "bg-muted font-semibold text-foreground"
                  : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
              )}
            >
              {icon}{label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Content */}
      <main className="flex-1 p-10 max-w-2xl">
        {activeTab === "profile" && (
          <div>
            <h1 className="text-2xl font-semibold text-foreground mb-8">Profile</h1>
            <div className="border border-border rounded-2xl divide-y divide-border">
              {/* Profile picture */}
              <div className="flex items-center justify-between px-6 py-5">
                <span className="text-sm font-medium text-foreground">Profile picture</span>
                <MemberAvatar member={user || undefined} size="lg" />
              </div>
              {/* Email */}
              <div className="flex items-center justify-between px-6 py-5">
                <span className="text-sm font-medium text-foreground">Email</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">{user?.email || "dexter@gmail.com"}</span>
                  <button className="p-1 rounded hover:bg-muted transition-colors text-muted-foreground">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                  </button>
                </div>
              </div>
              {/* Full name */}
              <div className="flex items-center justify-between px-6 py-5">
                <span className="text-sm font-medium text-foreground">Full name</span>
                <input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="text-sm bg-muted/60 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary/30 text-foreground w-48"
                />
              </div>
              {/* Title */}
              <div className="flex items-center justify-between px-6 py-5">
                <div>
                  <p className="text-sm font-medium text-foreground">Title</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Your job title or role</p>
                </div>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="text-sm bg-muted/60 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary/30 text-foreground w-48"
                />
              </div>
              {/* Username */}
              <div className="flex items-center justify-between px-6 py-5">
                <div>
                  <p className="text-sm font-medium text-foreground">Username</p>
                  <p className="text-xs text-muted-foreground mt-0.5">One word, like a nickname or first name</p>
                </div>
                <input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="text-sm bg-muted/60 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary/30 text-foreground w-48"
                />
              </div>
            </div>

            <div className="mt-4 flex justify-end">
              <Button onClick={handleSave} className="rounded-lg">
                {saved ? <><Check className="h-4 w-4" /> Saved</> : "Save Changes"}
              </Button>
            </div>

            {/* Workspace access */}
            <h2 className="text-lg font-semibold text-foreground mt-10 mb-4">Workspace access</h2>
            <div className="border border-border rounded-2xl px-6 py-5 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">Remove yourself from the workspace</p>
              <Button variant="destructive" size="sm" onClick={logout} className="rounded-lg">Leave Workspace</Button>
            </div>
          </div>
        )}

        {activeTab === "theme" && (
          <div>
            <h1 className="text-2xl font-semibold text-foreground mb-8">Theme</h1>
            <div className="grid grid-cols-2 gap-4">
              {(["light", "dark"] as Theme[]).map((t) => (
                <button
                  key={t}
                  onClick={() => setTheme(t)}
                  className={cn(
                    "relative rounded-2xl border-2 p-6 text-left transition-all",
                    theme === t ? "border-foreground" : "border-border hover:border-foreground/40"
                  )}
                >
                  {/* Mock preview */}
                  <div className={cn("w-full h-24 rounded-xl mb-4 flex gap-2 p-3", t === "dark" ? "bg-zinc-900" : "bg-gray-100")}>
                    <div className={cn("w-10 rounded-lg", t === "dark" ? "bg-zinc-800" : "bg-white")} />
                    <div className="flex-1 flex flex-col gap-1.5 pt-1">
                      <div className={cn("h-2 w-16 rounded", t === "dark" ? "bg-zinc-700" : "bg-gray-200")} />
                      <div className={cn("h-2 w-12 rounded", t === "dark" ? "bg-zinc-700" : "bg-gray-200")} />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold capitalize">{t}</span>
                    {theme === t && <div className="h-4 w-4 rounded-full bg-foreground flex items-center justify-center"><Check className="h-2.5 w-2.5 text-background" /></div>}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {activeTab === "color" && (
          <div>
            <h1 className="text-2xl font-semibold text-foreground mb-8">Color</h1>
            <div className="grid grid-cols-3 gap-4">
              {COLOR_OPTIONS.map((c) => (
                <button
                  key={c.value}
                  onClick={() => setColorMode(c.value)}
                  className={cn(
                    "relative rounded-2xl border-2 p-5 text-left transition-all",
                    colorMode === c.value ? "border-foreground" : "border-border hover:border-foreground/40"
                  )}
                >
                  <div className={cn("h-10 w-10 rounded-xl mb-3", c.bg)} />
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold">{c.label}</span>
                    {colorMode === c.value && <Check className="h-4 w-4" />}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
