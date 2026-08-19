"use client"
import { useState } from "react"
import { Search, Filter, Plus, PanelLeft } from "lucide-react"
import { Button } from "@/ui/button"
import { FieldsPopover } from "@/ui/FieldsPopover"
import type { VisibleFields } from "@/types"
import { cn } from "@/lib/utils"

interface TopBarProps {
  title: string
  view: "list" | "board"
  onViewChange: (v: "list" | "board") => void
  fields: VisibleFields
  onFieldChange: (field: keyof VisibleFields, value: boolean) => void
  onAddTask: () => void
  onSearch?: (query: string) => void
  onSidebarToggle: () => void
  addLabel?: string
}

export function TopBar({
  title, view, onViewChange, fields, onFieldChange, onAddTask, onSearch, onSidebarToggle, addLabel = "Add Task"
}: TopBarProps) {
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchValue, setSearchValue] = useState("")

  const handleSearch = (v: string) => {
    setSearchValue(v)
    onSearch?.(v)
  }

  return (
    <div className="flex items-center justify-between px-6 py-3 border-b border-border shrink-0 bg-background">
      <div className="flex items-center gap-3">
        <button
          onClick={onSidebarToggle}
          className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground transition-colors"
        >
          <PanelLeft className="h-4 w-4" />
        </button>
        {!searchOpen && (
          <h1 className="text-base font-semibold text-foreground">{title}</h1>
        )}
      </div>

      <div className="flex items-center gap-2">
        {/* Search */}
        {searchOpen ? (
          <div className="flex items-center gap-2 bg-muted/60 rounded-lg px-3 py-1.5 min-w-[220px]">
            <Search className="h-4 w-4 text-muted-foreground shrink-0" />
            <input
              autoFocus
              value={searchValue}
              onChange={(e) => handleSearch(e.target.value)}
              onBlur={() => { if (!searchValue) setSearchOpen(false) }}
              placeholder={title}
              className="bg-transparent text-sm outline-none flex-1 text-foreground placeholder:text-muted-foreground"
            />
            <kbd className="text-xs text-muted-foreground bg-background rounded px-1.5 py-0.5 border border-border">⌘F</kbd>
          </div>
        ) : (
          <button
            onClick={() => setSearchOpen(true)}
            className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground transition-colors"
          >
            <Search className="h-4 w-4" />
          </button>
        )}

        <FieldsPopover view={view} onViewChange={onViewChange} fields={fields} onFieldChange={onFieldChange} />

        <button className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground transition-colors">
          <Filter className="h-4 w-4" />
        </button>

        <Button onClick={onAddTask} size="sm" className="gap-1.5 rounded-lg">
          <Plus className="h-4 w-4" />
          {addLabel}
        </Button>
      </div>
    </div>
  )
}
