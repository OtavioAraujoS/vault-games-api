import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Game {
  @Prop({ required: true })
  nome: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  image: string;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: 'Não Iniciado' })
  status: string;

  @Prop({ required: true })
  userId: string;
}

export type GameDocument = Game & Document;

export const GameSchema = SchemaFactory.createForClass(Game);
