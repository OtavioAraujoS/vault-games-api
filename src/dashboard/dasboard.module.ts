import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Game, GameSchema } from 'src/games/schemas/game.schemas';
import { User, UserSchema } from 'src/user/schemas/user.schemas';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dasboard.service';
import { UserService } from 'src/user/user.service';
import { GameService } from 'src/games/game.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Game.name, schema: GameSchema }]),
  ],
  controllers: [DashboardController],
  providers: [DashboardService, UserService, GameService],
})
export class DashboardModule {}
