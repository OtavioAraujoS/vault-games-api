import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GameController } from './game.controller';
import { GameService } from './game.service';
import { UserModule } from '../user/user.module';
import { Game, GameSchema } from './schemas/game.schemas';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Game.name, schema: GameSchema }]),
    UserModule,
  ],
  controllers: [GameController],
  providers: [GameService],
})
export class GameModule {}
