import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DashboardModule } from './dashboard/dasboard.module';
import { GameModule } from './games/game.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: async () => ({
        uri: `mongodb+srv://${process.env.MONGOUSER}:${process.env.MONGOPASSWORD}@cluster0.gqgds.mongodb.net/?appName=Cluster0&retryWrites=true&w=majority`,
        connectionFactory: (connection) => {
          connection.on('error', (err) =>
            console.error('Mongoose connection error:', err)
          );
          return connection;
        },
      }),
    }),

    UserModule,
    GameModule,
    DashboardModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
