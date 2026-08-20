"use client"
import { useState, useEffect, useCallback } from "react"
import { useRouter, useParams } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import { Sidebar } from "@/ui/Sidebar"
import { PriorityBadge } from "@/ui/PriorityBadge"
import { MemberAvatar, MemberGroup } from "@/ui/MemberAvatar"
import { SubtasksTable } from "@/ui/SubtasksTable"
import { CommentBox } from "@/ui/CommentBox"
import { DatePicker } from "@/ui/DatePicker"
import { Skeleton } from "@/ui/skeleton"
import { Button } from "@/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/ui/dropdown-menu"
import { ArrowLeft, ChevronRight, Lock, Eye, Share2, MoreHorizontal, Plus, Tag } from "lucide-react"
import { api } from "@/lib/api"
import type { Task, Status, Priority, Subtask } from "@/types"
import { cn } from "@/lib/utils"

const STATUS_OPTIONS: { value: Status; label: string; color: string }[] = [
  { value: "backlog", label: "Backlog", color: "text-purple-500" },
  { value: "todo", label: "To Do", color: "text-gray-500" },
  { value: "doing", label: "In Progress", color: "text-blue-500" },
  { value: "completed", label: "Completed", color: "text-green-500" },
  { value: "on_hold", label: "On Hold", color: "text-yellow-500" },
]
const PRIORITIES: Priority[] = ["urgent", "high", "medium", "low", "none"]
const LABELS = ["Research", "Design", "Development", "Testing", "Deployment", "Backend", "Documentation", "Feature", "Security"]

export default function SingleTaskPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const params = useParams()
  const taskId = params.id as string

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [task, setTask] = useState<Task | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")

  const loadTask = useCallback(async () => {
    if (!taskId) return
    try {
      setLoading(true)
      const data = (await api.tasks.get(taskId)) as Task
      if (data && data._id) {
        setTask(data)
        setTitle(data.title || "")
        setDescription(data.description || "")
      } else {
        setNotFound(true)
      }
    } catch (err) {
      console.error("Failed to load task:", err)
      setNotFound(true)
    } finally {
      setLoading(false)
    }
  }, [taskId])

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/auth")
    } else if (user) {
      loadTask()
    }
  }, [user, isLoading, router, loadTask])

  const handleUpdate = async (data: Partial<Task>) => {
    if (!task) return
    const updated = { ...task, ...data }
    setTask(updated)
    try {
      await api.tasks.update(task._id, data)
    } catch (err) {
      console.error("Failed to update task:", err)
    }
  }

  const handleSubtaskUpdate = (subtaskId: string, data: Partial<Subtask>) => {
    if (!task) return
    const nextSubtasks = (task.subtasks || []).map(s => s._id === subtaskId ? { ...s, ...data } : s)
    handleUpdate({ subtasks: nextSubtasks })
  }

  const handleSubtaskAdd = () => {
    if (!task) return
    const newSubtask: Subtask = {
      _id: Date.now().toString(),
      title: "New Subtask",
      status: "todo",
      priority: "none",
      members: user ? [user] : [],
    }
    handleUpdate({ subtasks: [...(task.subtasks || []), newSubtask] })
  }

  const handleAddComment = async (content: string) => {
    if (!task) return
    const comment = {
      _id: Date.now().toString(),
      author: user || { _id: "g", name: "Guest", email: "", initials: "GU" },
      content,
      createdAt: new Date().toISOString(),
    }
    setTask(prev => prev ? { ...prev, comments: [...(prev.comments || []), comment] } : null)
    try {
      await api.tasks.addComment(task._id, content)
    } catch (err) {
      console.error("Failed to save comment:", err)
    }
  }

  const toggleLabel = (label: string) => {
    if (!task) return
    const current = task.labels || []
    const next = current.includes(label) ? current.filter(l => l !== label) : [...current, label]
    handleUpdate({ labels: next })
  }

  if (isLoading) return null

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar collapsed={sidebarCollapsed} />

      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Header / Breadcrumb */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-border shrink-0 bg-background">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <button
              onClick={() => router.push("/tasks")}
              className="flex items-center gap-1.5 hover:text-foreground transition-colors font-medium"
            >
              <ArrowLeft className="h-4 w-4" /> Tasks
            </button>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-foreground font-medium truncate max-w-sm">
              {loading ? "Loading..." : task?.title || "Task"}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground transition-colors"><Lock className="h-4 w-4" /></button>
            <button className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg hover:bg-muted text-muted-foreground text-sm transition-colors">
              <Eye className="h-4 w-4" />
              <span className="text-xs">{task?.viewerCount || 1}</span>
            </button>
            <button className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground transition-colors"><Share2 className="h-4 w-4" /></button>
            <button className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground transition-colors"><MoreHorizontal className="h-4 w-4" /></button>
          </div>
        </div>

        {/* Content */}
        <main className="flex-1 overflow-auto p-6 max-w-5xl w-full mx-auto">
          {loading ? (
            <div className="space-y-6">
              <Skeleton className="h-9 w-2/3 rounded-lg" />
              <div className="grid grid-cols-2 gap-4">
                <Skeleton className="h-10 rounded-lg" />
                <Skeleton className="h-10 rounded-lg" />
              </div>
              <Skeleton className="h-32 rounded-xl" />
              <Skeleton className="h-48 rounded-xl" />
            </div>
          ) : notFound || !task ? (
            <div className="text-center py-20">
              <h2 className="text-xl font-semibold mb-2">Task not found</h2>
              <p className="text-sm text-muted-foreground mb-6">The task you are looking for does not exist or has been deleted.</p>
              <Button onClick={() => router.push("/tasks")}>Back to Tasks</Button>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Title & Description */}
              <div className="space-y-3">
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  onBlur={() => { if (title !== task.title) handleUpdate({ title }) }}
                  className="w-full text-2xl font-bold bg-transparent outline-none placeholder:text-muted-foreground/50 border-b border-transparent focus:border-border pb-1"
                  placeholder="Task title..."
                />
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  onBlur={() => { if (description !== task.description) handleUpdate({ description }) }}
                  placeholder="Add a detailed description..."
                  rows={3}
                  className="w-full text-sm bg-muted/30 rounded-xl px-4 py-3 outline-none placeholder:text-muted-foreground resize-none border border-border/50 focus:border-border"
                />
              </div>

              {/* Properties Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-5 rounded-2xl bg-card border border-border">
                {/* Status */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-sm font-medium hover:bg-muted transition-colors">
                        <span className={STATUS_OPTIONS.find(s => s.value === task.status)?.color}>●</span>
                        {STATUS_OPTIONS.find(s => s.value === task.status)?.label || task.status}
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {STATUS_OPTIONS.map(s => (
                        <DropdownMenuItem key={s.value} onClick={() => handleUpdate({ status: s.value })}>
                          <span className={cn("mr-2", s.color)}>●</span> {s.label}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Priority */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Priority</span>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-sm font-medium hover:bg-muted transition-colors">
                        <PriorityBadge priority={task.priority} showLabel />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {PRIORITIES.map(p => (
                        <DropdownMenuItem key={p} onClick={() => handleUpdate({ priority: p })}>
                          <PriorityBadge priority={p} showLabel />
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Due Date */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Due Date</span>
                  <DatePicker
                    value={task.dueDate}
                    onChange={(d) => handleUpdate({ dueDate: d })}
                    placeholder="Set due date"
                    className="text-sm border border-border rounded-lg"
                  />
                </div>

                {/* Assignees */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Members</span>
                  <div className="flex items-center gap-1.5">
                    {task.members && task.members.length > 0 ? (
                      <MemberGroup members={task.members} size="sm" />
                    ) : (
                      <span className="text-xs text-muted-foreground">Unassigned</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Labels */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Tag className="h-4 w-4 text-muted-foreground" />
                  <h3 className="text-sm font-semibold text-foreground">Labels</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {LABELS.map((label) => {
                    const active = (task.labels || []).includes(label)
                    return (
                      <button
                        key={label}
                        onClick={() => toggleLabel(label)}
                        className={cn(
                          "text-xs px-3 py-1.5 rounded-lg border transition-colors font-medium",
                          active
                            ? "bg-primary text-primary-foreground border-primary"
                            : "border-border text-muted-foreground hover:border-foreground/40"
                        )}
                      >
                        {label}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Subtasks */}
              <div>
                <SubtasksTable
                  subtasks={task.subtasks || []}
                  onAdd={handleSubtaskAdd}
                  onUpdate={handleSubtaskUpdate}
                />
              </div>

              {/* Comments */}
              <div>
                <CommentBox
                  comments={task.comments || []}
                  onAddComment={handleAddComment}
                  currentUser={user}
                />
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
