import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop()
  avatar?: string;

  @Prop({ default: false })
  isGuest: boolean;

  @Prop({ default: 'DX' })
  initials: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
