import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GameModule } from './games/game.module';
import { UserModule } from './user/user.module';
import { DashboardModule } from './dashboard/dasboard.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://otavioaraujo490:BiiTJas8zsM9OONG@cluster0.gqgds.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'
    ),
    UserModule,
    GameModule,
    DashboardModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
