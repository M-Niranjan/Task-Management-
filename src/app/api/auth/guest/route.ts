import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const BACKEND = process.env.BACKEND_URL || "http://localhost:4000"
    const res = await fetch(`${BACKEND}/auth/guest`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    })

    if (res.ok) {
      const data = await res.json()
      return NextResponse.json(data)
    }

    const errData = await res.json().catch(() => ({}))
    return NextResponse.json(
      { error: errData.message || "Backend server or Database is not connected." },
      { status: res.status || 500 }
    )
  } catch (err: any) {
    return NextResponse.json(
      { error: "Backend server is offline or unreachable. Please check backend and MongoDB connection." },
      { status: 503 }
    )
  }
}
