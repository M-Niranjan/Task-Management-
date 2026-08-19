import { NextRequest, NextResponse } from "next/server"

const BACKEND = process.env.BACKEND_URL || "http://localhost:4000"

async function proxy(req: NextRequest, path: string, method: string, body?: unknown) {
  try {
    const token = req.headers.get("authorization")
    const res = await fetch(`${BACKEND}${path}`, {
      method,
      headers: { "Content-Type": "application/json", ...(token ? { Authorization: token } : {}) },
      body: body ? JSON.stringify(body) : undefined,
    })
    const data = await res.json()
    return NextResponse.json(data, { status: res.status })
  } catch {
    return NextResponse.json({ error: "Backend unavailable" }, { status: 503 })
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await req.json()
  return proxy(req, `/tasks/${id}`, "PATCH", body)
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return proxy(req, `/tasks/${id}`, "DELETE")
}
