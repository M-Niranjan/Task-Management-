"use client"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/ui/dialog"
import { Button } from "@/ui/button"
import { PriorityBadge } from "@/ui/PriorityBadge"
import { DatePicker } from "@/ui/DatePicker"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger
} from "@/ui/dropdown-menu"
import type { Priority, Status, Task } from "@/types"
import { cn } from "@/lib/utils"

const STATUS_OPTIONS: { value: Status; label: string }[] = [
  { value: "todo", label: "To Do" },
  { value: "doing", label: "Doing" },
  { value: "completed", label: "Completed" },
  { value: "on_hold", label: "On Hold" },
  { value: "backlog", label: "Backlog" },
]
const PRIORITIES: Priority[] = ["urgent", "high", "medium", "low", "none"]
const LABELS = ["Research", "Design", "Development", "Testing", "Deployment"]

interface AddTaskModalProps {
  open: boolean
  defaultStatus?: Status
  onClose: () => void
  onSubmit: (task: Partial<Task>) => void
}

export function AddTaskModal({ open, defaultStatus = "todo", onClose, onSubmit }: AddTaskModalProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [status, setStatus] = useState<Status>(defaultStatus)
  const [priority, setPriority] = useState<Priority>("none")
  const [dueDate, setDueDate] = useState<string | undefined>()
  const [selectedLabels, setSelectedLabels] = useState<string[]>([])

  const handleSubmit = () => {
    if (!title.trim()) return
    onSubmit({ title: title.trim(), description, status, priority, dueDate, labels: selectedLabels })
    setTitle(""); setDescription(""); setPriority("none"); setDueDate(undefined); setSelectedLabels([])
    onClose()
  }

  const toggleLabel = (label: string) => {
    setSelectedLabels(prev => prev.includes(label) ? prev.filter(l => l !== label) : [...prev, label])
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>New Task</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          <input
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Task title..."
            className="w-full text-base font-medium bg-transparent outline-none placeholder:text-muted-foreground/50 border-b border-border pb-2"
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          />

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add description..."
            rows={3}
            className="w-full text-sm bg-muted/40 rounded-lg px-3 py-2.5 outline-none placeholder:text-muted-foreground resize-none"
          />

          {/* Row: Status + Priority + Due date */}
          <div className="flex items-center gap-2 flex-wrap">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 text-xs rounded-lg">
                  {STATUS_OPTIONS.find(s => s.value === status)?.label || "Status"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {STATUS_OPTIONS.map(s => (
                  <DropdownMenuItem key={s.value} onClick={() => setStatus(s.value)}>{s.label}</DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 rounded-lg">
                  <PriorityBadge priority={priority} showLabel />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {PRIORITIES.map(p => (
                  <DropdownMenuItem key={p} onClick={() => setPriority(p)}>
                    <PriorityBadge priority={p} />
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <DatePicker value={dueDate} onChange={setDueDate} placeholder="Due date" className="h-8 border border-border rounded-lg text-xs" />
          </div>

          {/* Labels */}
          <div className="flex flex-wrap gap-1.5">
            {LABELS.map((label) => (
              <button
                key={label}
                onClick={() => toggleLabel(label)}
                className={cn(
                  "text-xs px-2.5 py-1 rounded-lg border transition-colors",
                  selectedLabels.includes(label)
                    ? "bg-foreground text-background border-foreground"
                    : "border-border text-muted-foreground hover:border-foreground/40"
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={!title.trim()}>Create Task</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
