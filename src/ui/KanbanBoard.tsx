"use client"
import { MoreHorizontal, Plus, GripVertical } from "lucide-react"
import type { Task, Status } from "@/types"
import { TaskCard } from "@/ui/TaskCard"
import { cn } from "@/lib/utils"

interface Column {
  id: Status
  label: string
  tasks: Task[]
}

const columnConfig: Record<Status, { label: string; dotColor: string }> = {
  todo:       { label: "To Do",     dotColor: "bg-gray-400" },
  doing:      { label: "Doing",     dotColor: "bg-blue-400" },
  completed:  { label: "Completed", dotColor: "bg-green-400" },
  on_hold:    { label: "On Hold",   dotColor: "bg-yellow-400" },
  backlog:    { label: "Backlog",   dotColor: "bg-purple-400" },
}

interface KanbanBoardProps {
  columns: Column[]
  onTaskClick: (task: Task) => void
  onAddTask: (status: Status) => void
}

export function KanbanBoard({ columns, onTaskClick, onAddTask }: KanbanBoardProps) {
  return (
    <div className="flex gap-4 overflow-x-auto pb-4 h-full">
      {columns.map((col) => {
        const config = columnConfig[col.id]
        return (
          <div key={col.id} className="flex-shrink-0 w-72 flex flex-col">
            {/* Column header */}
            <div className="flex items-center justify-between mb-3 px-1">
              <div className="flex items-center gap-2">
                <GripVertical className="h-4 w-4 text-muted-foreground/50" />
                <div className={cn("h-2 w-2 rounded-full", config.dotColor)} />
                <span className="text-sm font-semibold text-foreground">{config.label}</span>
                <span className="text-xs text-muted-foreground bg-muted rounded-full px-1.5 py-0.5 min-w-[20px] text-center">
                  {col.tasks.length}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => onAddTask(col.id)}
                  className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Plus className="h-4 w-4" />
                </button>
                <button className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
                  <MoreHorizontal className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Task cards */}
            <div className="flex flex-col gap-2.5 flex-1 min-h-[200px]">
              {col.tasks.map((task) => (
                <TaskCard key={task._id} task={task} onClick={onTaskClick} />
              ))}
            </div>

            {/* Add task footer */}
            <button
              onClick={() => onAddTask(col.id)}
              className="flex items-center gap-2 mt-3 px-2 py-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground text-sm transition-colors"
            >
              <Plus className="h-4 w-4" />
              Add Task
            </button>
          </div>
        )
      })}
    </div>
  )
}
