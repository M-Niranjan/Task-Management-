"use client"
import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import { Sidebar } from "@/ui/Sidebar"
import { TopBar } from "@/ui/TopBar"
import { PriorityBadge } from "@/ui/PriorityBadge"
import { MemberAvatar } from "@/ui/MemberAvatar"
import { MoreHorizontal, Plus } from "lucide-react"
import { format } from "date-fns"
import type { Project, VisibleFields, Priority } from "@/types"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/ui/dropdown-menu"
import { Button } from "@/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/ui/dialog"
import { DatePicker } from "@/ui/DatePicker"
import { Skeleton } from "@/ui/skeleton"
import { api } from "@/lib/api"

const PRIORITIES: Priority[] = ["urgent", "high", "medium", "low", "none"]
const DEFAULT_FIELDS: VisibleFields = { priority: true, members: true, dueDate: true, labels: false, status: false, reporter: false }

export default function ProjectsPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [view, setView] = useState<"list" | "board">("list")
  const [fields, setFields] = useState<VisibleFields>(DEFAULT_FIELDS)
  const [projects, setProjects] = useState<Project[]>([])
  const [loadingProjects, setLoadingProjects] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [addOpen, setAddOpen] = useState(false)
  const [newName, setNewName] = useState("")
  const [newPriority, setNewPriority] = useState<Priority>("none")
  const [newDueDate, setNewDueDate] = useState<string | undefined>()

  const loadProjects = useCallback(async () => {
    try {
      setLoadingProjects(true)
      const data = await api.projects.list()
      if (Array.isArray(data)) {
        setProjects(data as Project[])
      }
    } catch (err) {
      console.error("Failed to load projects:", err)
    } finally {
      setLoadingProjects(false)
    }
  }, [])

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/auth")
    } else if (user) {
      loadProjects()
    }
  }, [user, isLoading, router, loadProjects])

  const filtered = projects.filter(p => !searchQuery || (p.name && p.name.toLowerCase().includes(searchQuery.toLowerCase())))

  const handleAdd = async () => {
    if (!newName.trim()) return
    const payload = {
      name: newName.trim(),
      priority: newPriority,
      lead: user || undefined,
      dueDate: newDueDate,
    }
    try {
      const created = (await api.projects.create(payload)) as Project
      setProjects(prev => [created, ...prev])
    } catch (err) {
      console.error("Failed to create project:", err)
      const fallback: Project = {
        _id: Date.now().toString(),
        name: newName.trim(),
        priority: newPriority,
        lead: user || undefined,
        dueDate: newDueDate,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      setProjects(prev => [fallback, ...prev])
    }
    setNewName("")
    setNewPriority("none")
    setNewDueDate(undefined)
    setAddOpen(false)
  }

  if (isLoading) return null

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar collapsed={sidebarCollapsed} />

      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <TopBar
          title="Projects"
          view={view}
          onViewChange={setView}
          fields={fields}
          onFieldChange={(f, v) => setFields(prev => ({ ...prev, [f]: v }))}
          onAddTask={() => setAddOpen(true)}
          onSearch={setSearchQuery}
          onSidebarToggle={() => setSidebarCollapsed(p => !p)}
          addLabel="Add Project"
        />

        <main className="flex-1 overflow-auto p-6">
          <div className="border border-border rounded-xl overflow-hidden bg-card">
            <div className="grid grid-cols-[1fr_120px_100px_130px_80px] bg-muted/30 border-b border-border text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              <div className="px-4 py-3">Projects</div>
              {fields.priority && <div className="px-4 py-3">Priority</div>}
              {fields.members && <div className="px-4 py-3">Lead</div>}
              {fields.dueDate && <div className="px-4 py-3">Due Date</div>}
              <div className="px-4 py-3 text-right">Actions</div>
            </div>

            {loadingProjects ? (
              <div className="divide-y divide-border/50">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="grid grid-cols-[1fr_120px_100px_130px_80px] px-4 py-3.5 items-center">
                    <Skeleton className="h-4 w-48 rounded" />
                    {fields.priority && <Skeleton className="h-5 w-16 rounded-md" />}
                    {fields.members && <Skeleton className="h-6 w-6 rounded-full" />}
                    {fields.dueDate && <Skeleton className="h-4 w-20 rounded" />}
                    <Skeleton className="h-6 w-6 rounded-md ml-auto" />
                  </div>
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="p-8 text-center text-sm text-muted-foreground">No projects found. Create one below!</div>
            ) : (
              filtered.map((project) => (
                <div
                  key={project._id}
                  className="grid grid-cols-[1fr_120px_100px_130px_80px] items-center border-b border-border/50 last:border-b-0 hover:bg-muted/30 transition-colors cursor-pointer"
                  onClick={() => router.push(`/projects/${project._id}`)}
                >
                  <div className="px-4 py-3 text-sm font-medium text-foreground">{project.name}</div>
                  {fields.priority && (
                    <div className="px-4 py-3">
                      <PriorityBadge priority={project.priority} />
                    </div>
                  )}
                  {fields.members && (
                    <div className="px-4 py-3">
                      {project.lead ? (
                        <MemberAvatar member={project.lead} size="sm" />
                      ) : (
                        <button className="h-6 w-6 rounded-full border-2 border-dashed border-muted-foreground/30 flex items-center justify-center text-muted-foreground/60 hover:border-muted-foreground/60 transition-colors">
                          <Plus className="h-3 w-3" />
                        </button>
                      )}
                    </div>
                  )}
                  {fields.dueDate && (
                    <div className="px-4 py-3 text-sm text-muted-foreground">
                      {project.dueDate ? format(new Date(project.dueDate), "d MMM yyyy") : "—"}
                    </div>
                  )}
                  <div className="px-4 py-3 flex justify-end">
                    <button onClick={(e) => e.stopPropagation()} className="p-1 rounded hover:bg-muted text-muted-foreground">
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))
            )}

            <button
              onClick={() => setAddOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-colors w-full border-t border-border/40"
            >
              <Plus className="h-3.5 w-3.5" /> Add Project
            </button>
          </div>
        </main>
      </div>

      {/* Add Project Modal */}
      <Dialog open={addOpen} onOpenChange={(o) => !o && setAddOpen(false)}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>New Project</DialogTitle></DialogHeader>
          <div className="space-y-4 mt-2">
            <input
              autoFocus value={newName} onChange={(e) => setNewName(e.target.value)}
              placeholder="Project name..."
              className="w-full text-base font-medium bg-transparent outline-none placeholder:text-muted-foreground/50 border-b border-border pb-2"
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            />
            <div className="flex gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="rounded-lg">
                    <PriorityBadge priority={newPriority} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {PRIORITIES.map(p => (
                    <DropdownMenuItem key={p} onClick={() => setNewPriority(p)}>
                      <PriorityBadge priority={p} />
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              <DatePicker value={newDueDate} onChange={setNewDueDate} placeholder="Due date" className="border border-border rounded-lg px-3" />
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setAddOpen(false)}>Cancel</Button>
            <Button onClick={handleAdd} disabled={!newName.trim()}>Create Project</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
