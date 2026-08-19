"use client"
import { cn } from "@/lib/utils"
import { Calendar, MoreHorizontal, Plus, Tag } from "lucide-react"
import type { Task } from "@/types"
import { MemberAvatar } from "@/ui/MemberAvatar"
import { format } from "date-fns"

interface TaskCardProps {
  task: Task
  onClick: (task: Task) => void
  onMenuClick?: (task: Task) => void
}

const statusColors: Record<string, string> = {
  todo: "bg-gray-100 dark:bg-gray-800",
  doing: "bg-blue-50 dark:bg-blue-950",
  completed: "bg-green-50 dark:bg-green-950",
  on_hold: "bg-yellow-50 dark:bg-yellow-950",
  backlog: "bg-purple-50 dark:bg-purple-950",
}

export function TaskCard({ task, onClick, onMenuClick }: TaskCardProps) {
  const dueDateStr = task.dueDate ? format(new Date(task.dueDate), "d MMM") : null
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date()

  return (
    <div
      onClick={() => onClick(task)}
      className="bg-background border border-border rounded-xl p-3.5 cursor-pointer hover:border-foreground/20 hover:shadow-sm transition-all duration-150 group"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <h4 className="text-sm font-medium text-foreground leading-snug flex-1">{task.title}</h4>
        <button
          onClick={(e) => { e.stopPropagation(); onMenuClick?.(task) }}
          className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 rounded hover:bg-muted"
        >
          <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
        </button>
      </div>

      {/* Member + Due date row */}
      <div className="flex items-center justify-between">
        <MemberAvatar member={task.members[0]} size="sm" />
        {dueDateStr && (
          <span className={cn(
            "flex items-center gap-1 text-xs px-2 py-0.5 rounded-md font-medium",
            isOverdue
              ? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
              : "bg-muted text-muted-foreground"
          )}>
            <Calendar className="h-3 w-3" />
            {dueDateStr}
          </span>
        )}
      </div>

      {/* Labels */}
      {task.labels && task.labels.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2.5">
          {task.labels.slice(0, 2).map((label) => (
            <span key={label} className="inline-flex items-center gap-1 text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-md">
              <Tag className="h-2.5 w-2.5" />
              {label}
            </span>
          ))}
          {task.labels.length > 2 && (
            <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-md">
              +{task.labels.length - 2}
            </span>
          )}
        </div>
      )}
    </div>
  )
}
