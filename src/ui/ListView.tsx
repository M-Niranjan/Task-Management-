"use client"
import { ChevronDown, ChevronRight, MoreHorizontal, Plus } from "lucide-react"
import { useState } from "react"
import type { Task, Status, VisibleFields } from "@/types"
import { PriorityBadge } from "@/ui/PriorityBadge"
import { MemberGroup } from "@/ui/MemberAvatar"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

const STATUS_LABELS: Record<Status, string> = {
  todo: "To Do", doing: "Doing", completed: "Completed",
  on_hold: "On Hold", backlog: "Backlog",
}

interface ListViewProps {
  tasks: Task[]
  fields: VisibleFields
  onTaskClick: (task: Task) => void
  onAddTask: (status: Status) => void
}

interface GroupedTasks { [key: string]: Task[] }

export function ListView({ tasks, fields, onTaskClick, onAddTask }: ListViewProps) {
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({})

  const grouped: GroupedTasks = tasks.reduce((acc, task) => {
    const key = task.status
    if (!acc[key]) acc[key] = []
    acc[key].push(task)
    return acc
  }, {} as GroupedTasks)

  const statusOrder: Status[] = ["todo", "doing", "completed", "on_hold", "backlog"]
  const presentStatuses = statusOrder.filter(s => grouped[s]?.length > 0)

  return (
    <div className="flex flex-col gap-6">
      {presentStatuses.map((status) => {
        const isCollapsed = collapsed[status]
        const statusTasks = grouped[status] || []
        return (
          <div key={status}>
            {/* Section header */}
            <button
              onClick={() => setCollapsed(p => ({ ...p, [status]: !p[status] }))}
              className="flex items-center gap-2 mb-3 text-sm font-semibold text-foreground hover:text-foreground/80 transition-colors"
            >
              {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              {STATUS_LABELS[status]}
              <span className="text-xs text-muted-foreground font-normal">({statusTasks.length})</span>
            </button>

            {!isCollapsed && (
              <div className="border border-border rounded-xl overflow-hidden">
                {/* Table header */}
                <div className="grid bg-muted/30 border-b border-border text-xs font-semibold text-muted-foreground uppercase tracking-wide" style={{ gridTemplateColumns: `1fr ${fields.priority ? "120px" : ""} ${fields.members ? "100px" : ""} ${fields.dueDate ? "120px" : ""} 80px` }}>
                  <div className="px-4 py-2.5">Task</div>
                  {fields.priority && <div className="px-4 py-2.5">Priority</div>}
                  {fields.members && <div className="px-4 py-2.5">Members</div>}
                  {fields.dueDate && <div className="px-4 py-2.5">Due Date</div>}
                  <div className="px-4 py-2.5 text-right">Actions</div>
                </div>

                {/* Task rows */}
                {statusTasks.map((task, idx) => (
                  <div
                    key={task._id}
                    onClick={() => onTaskClick(task)}
                    className={cn(
                      "grid items-center cursor-pointer hover:bg-muted/40 transition-colors border-b border-border/50 last:border-b-0",
                    )}
                    style={{ gridTemplateColumns: `1fr ${fields.priority ? "120px" : ""} ${fields.members ? "100px" : ""} ${fields.dueDate ? "120px" : ""} 80px` }}
                  >
                    <div className="px-4 py-3 text-sm font-medium text-foreground">{task.title}</div>
                    {fields.priority && (
                      <div className="px-4 py-3">
                        <PriorityBadge priority={task.priority} />
                      </div>
                    )}
                    {fields.members && (
                      <div className="px-4 py-3">
                        <MemberGroup members={task.members} size="sm" />
                      </div>
                    )}
                    {fields.dueDate && (
                      <div className="px-4 py-3 text-sm text-muted-foreground">
                        {task.dueDate ? format(new Date(task.dueDate), "d MMM yyyy") : "—"}
                      </div>
                    )}
                    <div className="px-4 py-3 flex justify-end">
                      <button
                        onClick={(e) => e.stopPropagation()}
                        className="p-1 rounded hover:bg-muted text-muted-foreground"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}

                {/* Add task row */}
                <button
                  onClick={() => onAddTask(status)}
                  className="flex items-center gap-2 px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-colors w-full"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add Task
                </button>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
