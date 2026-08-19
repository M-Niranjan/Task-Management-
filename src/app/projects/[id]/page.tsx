"use client"
import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import { Sidebar } from "@/ui/Sidebar"
import { TopBar } from "@/ui/TopBar"
import { KanbanBoard } from "@/ui/KanbanBoard"
import { ListView } from "@/ui/ListView"
import { TaskDetailDrawer } from "@/ui/TaskDetailDrawer"
import { AddTaskModal } from "@/ui/AddTaskModal"
import type { Task, Status, VisibleFields } from "@/types"
import { ChevronRight } from "lucide-react"

const DEMO_TASKS: Task[] = [
  { _id: "t1", title: "Design Homepage", status: "todo", priority: "high", members: [{ _id: "u1", name: "Admin", email: "", initials: "AD" }], labels: [], dueDate: new Date("2026-09-12").toISOString(), subtasks: [], comments: [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { _id: "t2", title: "Develop Login Feature", status: "todo", priority: "low", members: [{ _id: "u2", name: "CN", email: "", initials: "CN" }], labels: [], dueDate: new Date("2026-09-15").toISOString(), subtasks: [], comments: [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { _id: "t3", title: "Test Payment Gateway", status: "todo", priority: "medium", members: [], labels: [], dueDate: new Date("2026-09-18").toISOString(), subtasks: [], comments: [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { _id: "t4", title: "Design Homepage", status: "doing", priority: "high", members: [{ _id: "u1", name: "Admin", email: "", initials: "AD" }], labels: [], dueDate: new Date("2026-09-12").toISOString(), subtasks: [], comments: [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { _id: "t5", title: "Develop Login Feature", status: "doing", priority: "low", members: [{ _id: "u2", name: "CN", email: "", initials: "CN" }], labels: [], dueDate: new Date("2026-09-15").toISOString(), subtasks: [], comments: [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { _id: "t6", title: "Test Payment Gateway", status: "doing", priority: "medium", members: [], labels: [], dueDate: new Date("2026-09-18").toISOString(), subtasks: [], comments: [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { _id: "t7", title: "Design Homepage", status: "completed", priority: "high", members: [{ _id: "u1", name: "Admin", email: "", initials: "AD" }], labels: [], dueDate: new Date("2026-09-12").toISOString(), subtasks: [], comments: [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { _id: "t8", title: "Develop Login Feature", status: "completed", priority: "low", members: [{ _id: "u2", name: "CN", email: "", initials: "CN" }], labels: [], dueDate: new Date("2026-09-15").toISOString(), subtasks: [], comments: [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
]

const DEFAULT_FIELDS: VisibleFields = { priority: true, members: true, dueDate: true, labels: false, status: false, reporter: false }
const STATUSES: Status[] = ["todo", "doing", "completed", "on_hold"]

export default function ProjectDetailPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const params = useParams()
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [view, setView] = useState<"list" | "board">("list")
  const [fields, setFields] = useState<VisibleFields>(DEFAULT_FIELDS)
  const [tasks, setTasks] = useState<Task[]>(DEMO_TASKS)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [addModalOpen, setAddModalOpen] = useState(false)
  const [addDefaultStatus, setAddDefaultStatus] = useState<Status>("todo")
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    if (!isLoading && !user) router.replace("/auth")
  }, [user, isLoading, router])

  const filtered = tasks.filter(t => !searchQuery || t.title.toLowerCase().includes(searchQuery.toLowerCase()))
  const columns = STATUSES.map(s => ({ id: s, label: s, tasks: filtered.filter(t => t.status === s) }))

  const handleTaskUpdate = (id: string, data: Partial<Task>) => {
    setTasks(prev => prev.map(t => t._id === id ? { ...t, ...data } : t))
    if (selectedTask?._id === id) setSelectedTask(prev => prev ? { ...prev, ...data } : null)
  }

  if (isLoading) return null

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar collapsed={sidebarCollapsed} />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 px-6 pt-3 pb-1 text-sm text-muted-foreground">
          <span className="cursor-pointer hover:text-foreground" onClick={() => router.push("/projects")}>Projects</span>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-foreground font-medium">Design Homepage</span>
        </div>

        <TopBar
          title="Tasks"
          view={view}
          onViewChange={setView}
          fields={fields}
          onFieldChange={(f, v) => setFields(prev => ({ ...prev, [f]: v }))}
          onAddTask={() => { setAddDefaultStatus("todo"); setAddModalOpen(true) }}
          onSearch={setSearchQuery}
          onSidebarToggle={() => setSidebarCollapsed(p => !p)}
        />

        <main className="flex-1 overflow-auto p-6">
          {view === "board"
            ? <KanbanBoard columns={columns} onTaskClick={setSelectedTask} onAddTask={s => { setAddDefaultStatus(s); setAddModalOpen(true) }} />
            : <ListView tasks={filtered} fields={fields} onTaskClick={setSelectedTask} onAddTask={s => { setAddDefaultStatus(s); setAddModalOpen(true) }} />
          }
        </main>
      </div>

      {selectedTask && (
        <TaskDetailDrawer
          task={selectedTask}
          currentUser={user}
          onClose={() => setSelectedTask(null)}
          onUpdate={handleTaskUpdate}
          onAddComment={(taskId, content) => {
            const comment = { _id: Date.now().toString(), author: user || { _id: "g", name: "Guest", email: "", initials: "GU" }, content, createdAt: new Date().toISOString() }
            setTasks(prev => prev.map(t => t._id === taskId ? { ...t, comments: [...t.comments, comment] } : t))
            setSelectedTask(prev => prev ? { ...prev, comments: [...prev.comments, comment] } : null)
          }}
        />
      )}

      <AddTaskModal open={addModalOpen} defaultStatus={addDefaultStatus} onClose={() => setAddModalOpen(false)}
        onSubmit={(data) => {
          const t: Task = { _id: Date.now().toString(), title: data.title || "New Task", status: data.status || "todo", priority: data.priority || "none", members: user ? [user] : [], labels: data.labels || [], dueDate: data.dueDate, subtasks: [], comments: [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
          setTasks(prev => [...prev, t])
        }}
      />
    </div>
  )
}
