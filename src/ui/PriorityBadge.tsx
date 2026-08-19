import { cn } from "@/lib/utils"
import type { Priority } from "@/types"
import { BarChart2, Minus } from "lucide-react"

const priorityConfig: Record<Priority, { label: string; color: string; icon: string }> = {
  urgent: { label: "Urgent", color: "text-red-500", icon: "bars" },
  high:   { label: "High",   color: "text-orange-500", icon: "bars" },
  medium: { label: "Medium", color: "text-yellow-500", icon: "bars" },
  low:    { label: "Low",    color: "text-gray-400", icon: "minus" },
  none:   { label: "No Priority", color: "text-gray-400", icon: "minus" },
}

interface PriorityBadgeProps {
  priority: Priority
  showLabel?: boolean
  className?: string
}

export function PriorityBadge({ priority, showLabel = true, className }: PriorityBadgeProps) {
  const config = priorityConfig[priority] || priorityConfig.none

  return (
    <span className={cn("inline-flex items-center gap-1.5 text-sm font-medium", config.color, className)}>
      {config.icon === "bars" ? (
        <BarChart2 className="h-3.5 w-3.5" />
      ) : (
        <Minus className="h-3.5 w-3.5" />
      )}
      {showLabel && <span>{config.label}</span>}
    </span>
  )
}

export { priorityConfig }
