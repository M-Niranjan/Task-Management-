"use client"
import { useState } from "react"
import { Paperclip, Send, Smile } from "lucide-react"
import type { Comment, Member } from "@/types"
import { MemberAvatar } from "@/ui/MemberAvatar"
import { formatDistanceToNow } from "date-fns"
import { cn } from "@/lib/utils"

interface CommentBoxProps {
  comments: Comment[]
  currentUser: Member | null
  onAddComment: (content: string) => void
}

export function CommentBox({ comments, currentUser, onAddComment }: CommentBoxProps) {
  const [reply, setReply] = useState("")
  const [newComment, setNewComment] = useState("")

  const handleSubmit = () => {
    if (!newComment.trim()) return
    onAddComment(newComment.trim())
    setNewComment("")
  }

  return (
    <div className="space-y-4">
      {/* Existing comments */}
      {comments.map((comment) => (
        <div key={comment._id} className="border border-border rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <MemberAvatar member={comment.author} size="sm" />
              <span className="text-sm font-semibold text-foreground">{comment.author.name}</span>
              <span className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <button className="p-1 rounded hover:bg-muted text-muted-foreground transition-colors">
                <Smile className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
          <p className="text-sm text-foreground pl-8">{comment.content}</p>

          {/* Reply input */}
          <div className="mt-3 pl-8 flex items-center gap-2">
            {currentUser && <MemberAvatar member={currentUser} size="sm" />}
            <div className="flex-1 flex items-center gap-2 bg-muted/40 rounded-lg px-3 py-2">
              <input
                placeholder="Leave a reply..."
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && reply.trim()) {
                    onAddComment(reply.trim())
                    setReply("")
                  }
                }}
              />
              <button className="text-muted-foreground hover:text-foreground transition-colors">
                <Paperclip className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => { if (reply.trim()) { onAddComment(reply.trim()); setReply("") } }}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Send className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      ))}

      {/* New comment */}
      <div className="border border-border rounded-xl p-4 flex items-start gap-3">
        {currentUser && <MemberAvatar member={currentUser} size="sm" className="mt-0.5" />}
        <div className="flex-1">
          <textarea
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            rows={2}
            className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground resize-none"
          />
          <div className="flex items-center justify-between mt-2">
            <button className="text-muted-foreground hover:text-foreground transition-colors">
              <Paperclip className="h-4 w-4" />
            </button>
            <button
              onClick={handleSubmit}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
