import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type TaskDocument = Task & Document;

@Schema({ timestamps: true })
export class Task {
  @Prop({ required: true, index: true })
  title: string;

  @Prop()
  description?: string;

  @Prop({ default: 'todo', enum: ['todo', 'doing', 'completed', 'on_hold', 'backlog'], index: true })
  status: string;

  @Prop({ default: 'none', enum: ['urgent', 'high', 'medium', 'low', 'none'], index: true })
  priority: string;

  @Prop([{ type: Object }])
  members: object[];

  @Prop([String])
  labels: string[];

  @Prop()
  dueDate?: string;

  @Prop({ type: Types.ObjectId, ref: 'Project', index: true })
  projectId?: Types.ObjectId;

  @Prop([{ type: Object }])
  subtasks: object[];

  @Prop([{ type: Object }])
  comments: object[];

  @Prop({ type: Object })
  createdBy?: object;

  @Prop({ type: Object })
  reporter?: object;

  @Prop([String])
  teams: string[];

  @Prop()
  resources?: string;

  @Prop({ default: 1 })
  viewerCount: number;
}

export const TaskSchema = SchemaFactory.createForClass(Task);

// High-performance compound indexes for rapid sorting and filtering
TaskSchema.index({ projectId: 1, createdAt: -1 });
TaskSchema.index({ status: 1, createdAt: -1 });
TaskSchema.index({ createdAt: -1 });
