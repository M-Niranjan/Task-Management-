"use client"
import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import { Sidebar } from "@/ui/Sidebar"
import { TopBar } from "@/ui/TopBar"
import { KanbanBoard } from "@/ui/KanbanBoard"
import { ListView } from "@/ui/ListView"
import { TaskDetailDrawer } from "@/ui/TaskDetailDrawer"
import { AddTaskModal } from "@/ui/AddTaskModal"
import type { Task, Status, VisibleFields } from "@/types"

const DEMO_TASKS: Task[] = [
  {
    _id: "1", title: "Write API Documentation", description: "Create clear and detailed API documentation to guide developers in using the inventory and sales metrics features effectively.",
    status: "todo", priority: "high", members: [{ _id: "u1", name: "Admin", email: "admin@test.com", initials: "AD" }],
    labels: ["Deployment", "Deployment"], dueDate: new Date("2026-07-29").toISOString(),
    subtasks: [
      { _id: "s1", title: "Subtask 1", priority: "high", members: [{ _id: "u1", name: "Admin", email: "", initials: "AD" }], dueDate: new Date("2026-09-12").toISOString(), status: "todo" },
      { _id: "s2", title: "Subtask 2", priority: "low", members: [{ _id: "u2", name: "CN", email: "", initials: "CN" }], dueDate: new Date("2026-09-15").toISOString(), status: "doing" },
      { _id: "s3", title: "Subtask 3", priority: "medium", members: [], dueDate: new Date("2026-09-18").toISOString(), status: "completed" },
    ],
    comments: [{ _id: "c1", author: { _id: "u3", name: "Ankit Dutta", email: "", initials: "AK" }, content: "dsds", createdAt: new Date().toISOString() }],
    viewerCount: 1, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
  },
  { _id: "2", title: "Implement Search Function", status: "todo", priority: "medium", members: [{ _id: "u1", name: "Admin", email: "", initials: "AD" }], labels: ["Deployment", "Deployment"], dueDate: new Date("2026-07-29").toISOString(), subtasks: [], comments: [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { _id: "3", title: "Deploy to Production", status: "todo", priority: "high", members: [{ _id: "u1", name: "Admin", email: "", initials: "AD" }], labels: ["Deployment", "Deployment"], dueDate: new Date("2026-07-29").toISOString(), subtasks: [], comments: [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { _id: "4", title: "Code Review Completed", status: "doing", priority: "medium", members: [{ _id: "u1", name: "Admin", email: "", initials: "AD" }], labels: ["Deployment", "Deployment"], dueDate: new Date("2026-07-29").toISOString(), subtasks: [], comments: [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { _id: "5", title: "Design Mockups Finalized", status: "doing", priority: "low", members: [{ _id: "u1", name: "Admin", email: "", initials: "AD" }], labels: ["Deployment", "Deployment"], dueDate: new Date("2026-07-29").toISOString(), subtasks: [], comments: [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { _id: "6", title: "Feature Testing Passed", status: "completed", priority: "high", members: [{ _id: "u4", name: "QA Team", email: "", initials: "QA" }], labels: ["Testing", "Passed"], dueDate: new Date("2026-07-30").toISOString(), subtasks: [], comments: [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { _id: "7", title: "UI Design Updated", status: "completed", priority: "medium", members: [{ _id: "u5", name: "Designer", email: "", initials: "DE" }], labels: ["Design", "Updated"], dueDate: new Date("2026-07-31").toISOString(), subtasks: [], comments: [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { _id: "8", title: "Security Audit Scheduled", status: "completed", priority: "urgent", members: [{ _id: "u6", name: "Security", email: "", initials: "SC" }], labels: ["Audit", "Scheduled"], dueDate: new Date("2026-08-01").toISOString(), subtasks: [], comments: [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { _id: "9", title: "UI Review", status: "on_hold", priority: "high", members: [{ _id: "u5", name: "Designer", email: "", initials: "DE" }], labels: ["Design", "Review"], dueDate: new Date("2026-08-05").toISOString(), subtasks: [], comments: [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { _id: "10", title: "Backend Integration", status: "on_hold", priority: "medium", members: [{ _id: "u7", name: "Dev Team", email: "", initials: "DV" }], labels: ["Development"], dueDate: new Date("2026-08-10").toISOString(), subtasks: [], comments: [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
]

const DEFAULT_FIELDS: VisibleFields = { priority: true, members: true, dueDate: true, labels: false, status: false, reporter: false }
const STATUSES: Status[] = ["todo", "doing", "completed", "on_hold"]

export default function TasksPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [view, setView] = useState<"list" | "board">("board")
  const [fields, setFields] = useState<VisibleFields>(DEFAULT_FIELDS)
  const [tasks, setTasks] = useState<Task[]>(DEMO_TASKS)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [addModalOpen, setAddModalOpen] = useState(false)
  const [addDefaultStatus, setAddDefaultStatus] = useState<Status>("todo")
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    if (!isLoading && !user) router.replace("/auth")
  }, [user, isLoading, router])

  const filteredTasks = tasks.filter(t =>
    !searchQuery || t.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const columns = STATUSES.map(s => ({
    id: s, label: s, tasks: filteredTasks.filter(t => t.status === s)
  }))

  const handleFieldChange = (field: keyof VisibleFields, value: boolean) => {
    setFields(prev => ({ ...prev, [field]: value }))
  }

  const handleAddTask = (status: Status) => {
    setAddDefaultStatus(status)
    setAddModalOpen(true)
  }

  const handleTaskSubmit = (data: Partial<Task>) => {
    const newTask: Task = {
      _id: Date.now().toString(),
      title: data.title || "New Task",
      description: data.description,
      status: data.status || "todo",
      priority: data.priority || "none",
      members: user ? [user] : [],
      labels: data.labels || [],
      dueDate: data.dueDate,
      subtasks: [],
      comments: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    setTasks(prev => [...prev, newTask])
  }

  const handleTaskUpdate = (id: string, data: Partial<Task>) => {
    setTasks(prev => prev.map(t => t._id === id ? { ...t, ...data } : t))
    if (selectedTask?._id === id) setSelectedTask(prev => prev ? { ...prev, ...data } : null)
  }

  if (isLoading) return null

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar collapsed={sidebarCollapsed} />

      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <TopBar
          title="Tasks"
          view={view}
          onViewChange={setView}
          fields={fields}
          onFieldChange={handleFieldChange}
          onAddTask={() => { setAddDefaultStatus("todo"); setAddModalOpen(true) }}
          onSearch={setSearchQuery}
          onSidebarToggle={() => setSidebarCollapsed(p => !p)}
        />

        <main className={`flex-1 overflow-auto p-6 ${view === "board" ? "" : ""}`}>
          {view === "board" ? (
            <KanbanBoard columns={columns} onTaskClick={setSelectedTask} onAddTask={handleAddTask} />
          ) : (
            <ListView tasks={filteredTasks} fields={fields} onTaskClick={setSelectedTask} onAddTask={handleAddTask} />
          )}
        </main>
      </div>

      {selectedTask && (
        <TaskDetailDrawer
          task={selectedTask}
          currentUser={user}
          onClose={() => setSelectedTask(null)}
          onUpdate={handleTaskUpdate}
          onAddComment={(taskId, content) => {
            const comment = {
              _id: Date.now().toString(),
              author: user || { _id: "g", name: "Guest", email: "", initials: "GU" },
              content,
              createdAt: new Date().toISOString(),
            }
            setTasks(prev => prev.map(t => t._id === taskId ? { ...t, comments: [...t.comments, comment] } : t))
            setSelectedTask(prev => prev ? { ...prev, comments: [...prev.comments, comment] } : null)
          }}
        />
      )}

      <AddTaskModal
        open={addModalOpen}
        defaultStatus={addDefaultStatus}
        onClose={() => setAddModalOpen(false)}
        onSubmit={handleTaskSubmit}
      />
    </div>
  )
}
