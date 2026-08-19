import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    // Try to proxy to NestJS backend
    const res = await fetch("http://localhost:4000/auth/guest", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    })
    if (res.ok) {
      const data = await res.json()
      return NextResponse.json(data)
    }
  } catch {
    // Fallback: create local guest session
  }

  // Fallback guest user
  const guestId = `guest-${Date.now()}`
  const user = {
    _id: guestId,
    name: "Dexter",
    email: "dexter@gmail.com",
    initials: "DX",
    isGuest: true,
  }
  const token = `guest-token-${guestId}`
  return NextResponse.json({ user, token })
}
