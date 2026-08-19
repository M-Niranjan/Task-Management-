"use client"
import { useState } from "react"
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isSameMonth, getDay } from "date-fns"
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react"
import { cn } from "@/lib/utils"
import { Popover, PopoverContent, PopoverTrigger } from "@/ui/popover"

interface DatePickerProps {
  value?: string
  onChange: (date: string | undefined) => void
  placeholder?: string
  className?: string
}

export function DatePicker({ value, onChange, placeholder = "Pick a date", className }: DatePickerProps) {
  const [viewDate, setViewDate] = useState(value ? new Date(value) : new Date())
  const [open, setOpen] = useState(false)

  const selected = value ? new Date(value) : null
  const monthStart = startOfMonth(viewDate)
  const monthEnd = endOfMonth(viewDate)
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd })
  const startPad = getDay(monthStart)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button className={cn("flex items-center gap-2 text-sm px-2.5 py-1.5 rounded-lg hover:bg-muted transition-colors", className)}>
          <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
          {selected ? (
            <span className="font-medium">{format(selected, "d MMM yyyy")}</span>
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-0" align="start">
        {/* Month nav */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <button onClick={() => setViewDate(subMonths(viewDate, 1))} className="p-1 rounded hover:bg-muted transition-colors">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="text-sm font-semibold">{format(viewDate, "MMMM yyyy")}</span>
          <button onClick={() => setViewDate(addMonths(viewDate, 1))} className="p-1 rounded hover:bg-muted transition-colors">
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        {/* Day labels */}
        <div className="grid grid-cols-7 px-4 pt-2 pb-1">
          {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
            <div key={d} className="text-center text-xs text-muted-foreground font-medium py-1">{d}</div>
          ))}
        </div>

        {/* Days grid */}
        <div className="grid grid-cols-7 px-4 pb-4 gap-y-1">
          {Array.from({ length: startPad }).map((_, i) => <div key={`pad-${i}`} />)}
          {days.map((day) => {
            const isSelected = selected && isSameDay(day, selected)
            const isToday = isSameDay(day, new Date())
            return (
              <button
                key={day.toISOString()}
                onClick={() => { onChange(day.toISOString()); setOpen(false) }}
                className={cn(
                  "h-8 w-8 mx-auto flex items-center justify-center text-sm rounded-full transition-colors",
                  isSelected && "bg-foreground text-background font-semibold",
                  !isSelected && isToday && "bg-muted font-semibold",
                  !isSelected && !isToday && "hover:bg-muted"
                )}
              >
                {format(day, "d")}
              </button>
            )
          })}
        </div>
      </PopoverContent>
    </Popover>
  )
}
