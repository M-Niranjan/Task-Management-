import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProjectDocument = Project & Document;

@Schema({ timestamps: true })
export class Project {
  @Prop({ required: true, index: true })
  name: string;

  @Prop({ default: 'none', enum: ['urgent', 'high', 'medium', 'low', 'none'], index: true })
  priority: string;

  @Prop({ type: Object })
  lead?: object;

  @Prop()
  dueDate?: string;

  @Prop({ type: Object })
  createdBy?: object;
}

export const ProjectSchema = SchemaFactory.createForClass(Project);

// Fast sorting index
ProjectSchema.index({ createdAt: -1 });
