"use client"
import { useState } from "react"
import { Popover, PopoverContent, PopoverTrigger } from "@/ui/popover"
import { Checkbox } from "@/ui/checkbox"
import { Button } from "@/ui/button"
import { LayoutList, LayoutGrid, SlidersHorizontal } from "lucide-react"
import { cn } from "@/lib/utils"
import type { VisibleFields } from "@/types"

interface FieldsPopoverProps {
  view: "list" | "board"
  onViewChange: (v: "list" | "board") => void
  fields: VisibleFields
  onFieldChange: (field: keyof VisibleFields, value: boolean) => void
}

const fieldLabels: Array<{ key: keyof VisibleFields; label: string }> = [
  { key: "priority", label: "Priority" },
  { key: "members", label: "Members" },
  { key: "dueDate", label: "Due Date" },
  { key: "members", label: "Members" },
  { key: "labels", label: "Labels" },
  { key: "status", label: "Status" },
  { key: "reporter", label: "Reporter" },
]

// deduplicated list
const uniqueFields: Array<{ key: keyof VisibleFields; label: string }> = [
  { key: "priority", label: "Priority" },
  { key: "members", label: "Members" },
  { key: "dueDate", label: "Due Date" },
  { key: "labels", label: "Labels" },
  { key: "status", label: "Status" },
  { key: "reporter", label: "Reporter" },
]

export function FieldsPopover({ view, onViewChange, fields, onFieldChange }: FieldsPopoverProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1.5 h-8 px-3 rounded-lg border-border">
          <SlidersHorizontal className="h-3.5 w-3.5" />
          Fields
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-2" align="end">
        {/* View toggle */}
        <div className="flex rounded-lg border border-border overflow-hidden mb-3">
          <button
            onClick={() => onViewChange("list")}
            className={cn(
              "flex-1 flex items-center justify-center gap-1.5 py-1.5 text-sm font-medium transition-colors",
              view === "list" ? "bg-foreground text-background" : "hover:bg-muted text-muted-foreground"
            )}
          >
            <LayoutList className="h-3.5 w-3.5" /> List
          </button>
          <button
            onClick={() => onViewChange("board")}
            className={cn(
              "flex-1 flex items-center justify-center gap-1.5 py-1.5 text-sm font-medium transition-colors",
              view === "board" ? "bg-foreground text-background" : "hover:bg-muted text-muted-foreground"
            )}
          >
            <LayoutGrid className="h-3.5 w-3.5" /> Board
          </button>
        </div>

        {/* Fields list */}
        <div className="space-y-1">
          {uniqueFields.map(({ key, label }) => (
            <label key={key} className="flex items-center justify-between px-2 py-1.5 rounded-md hover:bg-muted cursor-pointer">
              <span className="text-sm text-foreground">{label}</span>
              <Checkbox
                checked={fields[key]}
                onCheckedChange={(v) => onFieldChange(key, !!v)}
              />
            </label>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}
