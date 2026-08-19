"use client"
import { X, Lock, Eye, Share2, MoreHorizontal, LayoutPanelTop, Tag, Plus, Settings, ChevronDown } from "lucide-react"
import type { Task, Priority, Status, Member } from "@/types"
import { PriorityBadge, priorityConfig } from "@/ui/PriorityBadge"
import { MemberAvatar, MemberGroup } from "@/ui/MemberAvatar"
import { SubtasksTable } from "@/ui/SubtasksTable"
import { CommentBox } from "@/ui/CommentBox"
import { DatePicker } from "@/ui/DatePicker"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { format } from "date-fns"

const STATUS_OPTIONS: { value: Status; label: string; color: string }[] = [
  { value: "backlog", label: "Backlog", color: "text-purple-500" },
  { value: "todo", label: "To Do", color: "text-gray-500" },
  { value: "doing", label: "In Progress", color: "text-blue-500" },
  { value: "completed", label: "Completed", color: "text-green-500" },
  { value: "on_hold", label: "On Hold", color: "text-yellow-500" },
]
const PRIORITIES: Priority[] = ["urgent", "high", "medium", "low", "none"]
const LABELS = ["Research", "Design", "Development", "Testing", "Deployment"]

interface TaskDetailDrawerProps {
  task: Task | null
  currentUser: Member | null
  onClose: () => void
  onUpdate: (id: string, data: Partial<Task>) => void
  onAddComment: (taskId: string, content: string) => void
}

export function TaskDetailDrawer({ task, currentUser, onClose, onUpdate, onAddComment }: TaskDetailDrawerProps) {
  if (!task) return null

  const statusConfig = STATUS_OPTIONS.find(s => s.value === task.status)

  return (
    <div className="fixed inset-0 z-50 flex" onClick={onClose}>
      <div className="flex-1 bg-black/40" />
      <div
        className="w-full max-w-5xl h-full bg-background border-l border-border flex flex-col overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top bar */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-border shrink-0">
          <div className="flex items-center gap-2">
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground transition-colors">
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="flex items-center gap-1.5">
            <button className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground transition-colors"><Lock className="h-4 w-4" /></button>
            <button className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg hover:bg-muted text-muted-foreground text-sm transition-colors">
              <Eye className="h-4 w-4" />
              <span className="text-xs">{task.viewerCount || 1}</span>
            </button>
            <button className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground transition-colors"><Share2 className="h-4 w-4" /></button>
            <button className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground transition-colors"><MoreHorizontal className="h-4 w-4" /></button>
            <button className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground transition-colors"><LayoutPanelTop className="h-4 w-4" /></button>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Left: main content */}
          <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6">
            <div>
              <h1 className="text-2xl font-semibold text-foreground mb-2">{task.title}</h1>
              {task.description && <p className="text-sm text-muted-foreground">{task.description}</p>}
            </div>

            {/* Properties */}
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">A</span>
                <MemberAvatar member={task.members[0]} size="sm" />
                {task.members[0] && <span className="font-medium">{task.members[0].name}</span>}
              </div>
              {task.dueDate && (
                <DatePicker value={task.dueDate} onChange={(d) => onUpdate(task._id, { dueDate: d })} />
              )}
            </div>

            {/* Labels */}
            <div className="flex items-start gap-3">
              <span className="text-sm text-muted-foreground w-20 shrink-0 mt-0.5">Labels</span>
              <div className="flex flex-wrap gap-2">
                {task.labels.map((label) => (
                  <span key={label} className="inline-flex items-center gap-1 text-xs bg-muted text-muted-foreground px-2.5 py-1 rounded-lg">
                    <Tag className="h-3 w-3" />{label}
                  </span>
                ))}
                <button className="inline-flex items-center gap-1 text-xs border border-dashed border-border text-muted-foreground px-2.5 py-1 rounded-lg hover:bg-muted transition-colors">
                  <Plus className="h-3 w-3" /> Add Label
                </button>
              </div>
            </div>

            {/* Resources */}
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground w-20 shrink-0">Resources</span>
              <input placeholder="Add document or link..." className="text-sm bg-transparent outline-none text-muted-foreground placeholder:text-muted-foreground/60 flex-1" />
            </div>

            {/* Subtasks */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
                <h3 className="text-sm font-semibold text-foreground">Subtasks</h3>
              </div>
              <SubtasksTable subtasks={task.subtasks} />
            </div>

            {/* Comments */}
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-3">Subtasks</h3>
              <CommentBox comments={task.comments} currentUser={currentUser} onAddComment={(c) => onAddComment(task._id, c)} />
            </div>
          </div>

          {/* Right: Details panel */}
          <div className="w-72 border-l border-border overflow-y-auto p-4 space-y-1 shrink-0">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <ChevronDown className="h-4 w-4" />Details
              </div>
              <div className="flex gap-1">
                <button className="p-1 rounded hover:bg-muted"><Plus className="h-4 w-4 text-muted-foreground" /></button>
                <button className="p-1 rounded hover:bg-muted"><Settings className="h-4 w-4 text-muted-foreground" /></button>
              </div>
            </div>

            {/* Status */}
            <DetailRow label="Status">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className={cn("text-sm font-medium hover:bg-muted px-2 py-1 rounded-lg transition-colors flex items-center gap-1", statusConfig?.color)}>
                    <span className="h-2 w-2 rounded-full bg-current inline-block" />
                    {statusConfig?.label}
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {STATUS_OPTIONS.map((s) => (
                    <DropdownMenuItem key={s.value} onClick={() => onUpdate(task._id, { status: s.value })} className={s.color}>
                      <span className="h-2 w-2 rounded-full bg-current inline-block" />
                      {s.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </DetailRow>

            {/* Priority */}
            <DetailRow label="Priority">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="hover:bg-muted px-2 py-1 rounded-lg transition-colors flex items-center gap-1">
                    <PriorityBadge priority={task.priority} />
                    <ChevronDown className="h-3 w-3 text-muted-foreground" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <div className="px-2 py-1 text-xs font-semibold text-muted-foreground">Priority</div>
                  {PRIORITIES.map((p) => (
                    <DropdownMenuItem key={p} onClick={() => onUpdate(task._id, { priority: p })}>
                      <PriorityBadge priority={p} />
                      {p === task.priority && <span className="ml-auto">✓</span>}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </DetailRow>

            {/* Members */}
            <DetailRow label="Members">
              <MemberGroup members={task.members} onAdd={() => {}} />
            </DetailRow>

            {/* Dates */}
            <DetailRow label="Dates">
              <DatePicker value={task.dueDate} onChange={(d) => onUpdate(task._id, { dueDate: d })} placeholder="Jan 10" />
            </DetailRow>

            {/* Labels */}
            <DetailRow label="Labels">
              <div className="flex flex-wrap gap-1">
                {task.labels.map((l) => (
                  <span key={l} className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-md">{l}</span>
                ))}
              </div>
            </DetailRow>

            {/* Updates */}
            <div className="mt-4 pt-4 border-t border-border">
              <div className="flex items-center gap-2 text-sm font-semibold text-foreground mb-3">
                <ChevronDown className="h-4 w-4" />Updates
              </div>
              <div className="space-y-3 text-xs text-muted-foreground">
                <p><span className="font-medium text-foreground">You</span> changed priority from No priority to Ur...</p>
                <p><span className="font-medium text-foreground">You</span> posted an update · Aug 2026</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function DetailRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-1.5 px-1">
      <span className="text-sm text-muted-foreground w-20 shrink-0">{label}</span>
      <div className="flex-1">{children}</div>
    </div>
  )
}
