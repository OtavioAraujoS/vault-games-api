import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class User {
  @Prop({ required: true })
  nome: string;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: '12345' })
  password: string;

  @Prop({ default: 'userPicture' })
  picture: string;
}

export type UserDocument = User & Document;

export const UserSchema = SchemaFactory.createForClass(User);
