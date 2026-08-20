import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { Task } from '@/models/Task';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const body = await request.json();
    const { id } = await params;

    const comment = {
      _id: new Date().getTime().toString(),
      content: body.content,
      author: body.author || { name: 'Guest', initials: 'GU' },
      createdAt: new Date().toISOString(),
    };

    const task = await Task.findByIdAndUpdate(
      id,
      { $push: { comments: comment } },
      { new: true }
    ).exec();

    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    return NextResponse.json(task, { status: 201 });
  } catch (error) {
    console.error('Add Comment Error:', error);
    return NextResponse.json(
      { error: 'Failed to add comment' },
      { status: 500 }
    );
  }
}
