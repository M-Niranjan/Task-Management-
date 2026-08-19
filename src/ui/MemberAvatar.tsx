import { Avatar, AvatarFallback, AvatarImage } from "@/ui/avatar"
import { cn } from "@/lib/utils"
import { Plus } from "lucide-react"
import type { Member } from "@/types"

interface MemberAvatarProps {
  member?: Member
  size?: "sm" | "md" | "lg"
  className?: string
}

const sizeMap = { sm: "h-6 w-6 text-[10px]", md: "h-7 w-7 text-xs", lg: "h-9 w-9 text-sm" }

export function MemberAvatar({ member, size = "md", className }: MemberAvatarProps) {
  if (!member) return null
  return (
    <Avatar className={cn(sizeMap[size], className)}>
      {member.avatar && <AvatarImage src={member.avatar} alt={member.name} />}
      <AvatarFallback className="font-semibold bg-gradient-to-br from-violet-400 to-indigo-600 text-white">
        {member.initials || member.name.slice(0, 2).toUpperCase()}
      </AvatarFallback>
    </Avatar>
  )
}

interface MemberGroupProps {
  members: Member[]
  maxShow?: number
  size?: "sm" | "md" | "lg"
  onAdd?: () => void
  className?: string
}

export function MemberGroup({ members, maxShow = 2, size = "md", onAdd, className }: MemberGroupProps) {
  const shown = members.slice(0, maxShow)
  const rest = members.length - shown.length

  return (
    <div className={cn("flex items-center", className)}>
      <div className="flex -space-x-1.5">
        {shown.map((m) => (
          <MemberAvatar key={m._id} member={m} size={size} className="ring-2 ring-background" />
        ))}
        {rest > 0 && (
          <div className={cn("flex items-center justify-center rounded-full bg-muted text-muted-foreground font-semibold ring-2 ring-background", sizeMap[size])}>
            +{rest}
          </div>
        )}
      </div>
      {onAdd && (
        <button onClick={onAdd} className={cn("flex items-center justify-center rounded-full border-2 border-dashed border-muted-foreground/30 text-muted-foreground hover:border-muted-foreground/60 hover:text-muted-foreground/80 transition-colors ml-1", sizeMap[size])}>
          <Plus className="h-3 w-3" />
        </button>
      )}
    </div>
  )
}
