"use client"
import { useState } from "react"
import { format } from "date-fns"
import { MoreHorizontal, Plus, Tag } from "lucide-react"
import type { Task, Subtask, Priority, Status } from "@/types"
import { PriorityBadge, priorityConfig } from "@/ui/PriorityBadge"
import { MemberGroup } from "@/ui/MemberAvatar"
import { Button } from "@/ui/button"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger
} from "@/ui/dropdown-menu"
import { cn } from "@/lib/utils"

interface SubtasksTableProps {
  subtasks: Subtask[]
  onAdd?: () => void
  onUpdate?: (id: string, data: Partial<Subtask>) => void
}

const priorities: Priority[] = ["urgent", "high", "medium", "low", "none"]

export function SubtasksTable({ subtasks, onAdd, onUpdate }: SubtasksTableProps) {
  return (
    <div>
      <div className="border border-border rounded-xl overflow-hidden">
        {/* Header */}
        <div className="grid grid-cols-[1fr_110px_90px_110px_60px] bg-muted/30 border-b border-border text-xs font-semibold text-muted-foreground uppercase tracking-wide">
          <div className="px-4 py-2.5">Task</div>
          <div className="px-4 py-2.5">Priority</div>
          <div className="px-4 py-2.5">Members</div>
          <div className="px-4 py-2.5">Due Date</div>
          <div className="px-4 py-2.5">Actions</div>
        </div>

        {subtasks.map((subtask) => (
          <div key={subtask._id} className="grid grid-cols-[1fr_110px_90px_110px_60px] items-center border-b border-border/50 last:border-b-0 hover:bg-muted/20 transition-colors">
            <div className="px-4 py-3 text-sm font-medium">{subtask.title}</div>
            <div className="px-4 py-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="hover:bg-muted rounded-md px-1 py-0.5 transition-colors">
                    <PriorityBadge priority={subtask.priority} />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-40">
                  <div className="px-2 py-1 text-xs font-semibold text-muted-foreground">Priority</div>
                  {priorities.map((p) => (
                    <DropdownMenuItem key={p} onClick={() => onUpdate?.(subtask._id, { priority: p })}>
                      <PriorityBadge priority={p} />
                      {p === subtask.priority && <span className="ml-auto text-foreground">✓</span>}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="px-4 py-3">
              <MemberGroup members={subtask.members} size="sm" />
            </div>
            <div className="px-4 py-3 text-sm text-muted-foreground">
              {subtask.dueDate ? format(new Date(subtask.dueDate), "d MMM yyyy") : "—"}
            </div>
            <div className="px-4 py-3">
              <button className="p-1 rounded hover:bg-muted text-muted-foreground">
                <MoreHorizontal className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}

        {/* Add subtask */}
        <button
          onClick={onAdd}
          className="flex items-center gap-2 px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-colors w-full"
        >
          <Plus className="h-3.5 w-3.5" />
          Add Subtasks
        </button>
      </div>
    </div>
  )
}
