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
import { api } from "@/lib/api"
import type { Task, Status, VisibleFields } from "@/types"

const DEFAULT_FIELDS: VisibleFields = { priority: true, members: true, dueDate: true, labels: false, status: false, reporter: false }
const STATUSES: Status[] = ["todo", "doing", "completed", "on_hold"]

export default function TasksPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [view, setView] = useState<"list" | "board">("board")
  const [fields, setFields] = useState<VisibleFields>(DEFAULT_FIELDS)
  const [tasks, setTasks] = useState<Task[]>([])
  const [loadingTasks, setLoadingTasks] = useState(true)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [addModalOpen, setAddModalOpen] = useState(false)
  const [addDefaultStatus, setAddDefaultStatus] = useState<Status>("todo")
  const [searchQuery, setSearchQuery] = useState("")

  const loadTasks = useCallback(async () => {
    try {
      setLoadingTasks(true)
      const data = await api.tasks.list()
      if (Array.isArray(data)) {
        setTasks(data as Task[])
      }
    } catch (err) {
      console.error("Failed to load tasks from API:", err)
    } finally {
      setLoadingTasks(false)
    }
  }, [])

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/auth")
    } else if (user) {
      loadTasks()
    }
  }, [user, isLoading, router, loadTasks])

  const filteredTasks = tasks.filter(t =>
    !searchQuery || (t.title && t.title.toLowerCase().includes(searchQuery.toLowerCase()))
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

  const handleTaskSubmit = async (data: Partial<Task>) => {
    try {
      const payload = {
        title: data.title || "New Task",
        description: data.description || "",
        status: data.status || "todo",
        priority: data.priority || "none",
        members: user ? [user] : [],
        labels: data.labels || [],
        dueDate: data.dueDate,
        subtasks: [],
        comments: [],
      }
      const created = (await api.tasks.create(payload)) as Task
      setTasks(prev => [created, ...prev])
    } catch (err) {
      console.error("Failed to create task:", err)
      // Fallback local addition if API call fails
      const fallbackTask: Task = {
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
      setTasks(prev => [fallbackTask, ...prev])
    }
  }

  const handleTaskUpdate = async (id: string, data: Partial<Task>) => {
    setTasks(prev => prev.map(t => t._id === id ? { ...t, ...data } : t))
    if (selectedTask?._id === id) setSelectedTask(prev => prev ? { ...prev, ...data } : null)
    try {
      await api.tasks.update(id, data)
    } catch (err) {
      console.error("Failed to update task on server:", err)
    }
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
          {loadingTasks ? (
            <div className="flex items-center justify-center h-64 text-sm text-muted-foreground">
              Loading tasks...
            </div>
          ) : view === "board" ? (
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
          onAddComment={async (taskId, content) => {
            const comment = {
              _id: Date.now().toString(),
              author: user || { _id: "g", name: "Guest", email: "", initials: "GU" },
              content,
              createdAt: new Date().toISOString(),
            }
            setTasks(prev => prev.map(t => t._id === taskId ? { ...t, comments: [...t.comments, comment] } : t))
            setSelectedTask(prev => prev ? { ...prev, comments: [...prev.comments, comment] } : null)
            try {
              await api.tasks.addComment(taskId, content)
            } catch (err) {
              console.error("Failed to save comment:", err)
            }
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
