import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateGameDto } from './dto/create-game.dto';
import { Game, GameDocument } from './schemas/game.schemas';

@Injectable()
export class GameService {
  private readonly logger = new Logger(GameService.name);

  constructor(@InjectModel(Game.name) private gameModel: Model<GameDocument>) {}

  async findAll(): Promise<Game[]> {
    this.logger.log('Fetching all games');
    const games = await this.gameModel.find().exec();
    this.logger.log(`Found ${games.length} games`);
    return games;
  }

  async findByUser(userId: string): Promise<Game[]> {
    this.logger.log(`Fetching games for user: ${userId}`);
    const games = await this.gameModel.find({ userId }).exec();
    this.logger.log(`Found ${games.length} games for user: ${userId}`);
    return games;
  }

  async create(createGameDto: CreateGameDto): Promise<Game> {
    this.logger.log('Creating a new game');
    const newGame = new this.gameModel(createGameDto);
    const savedGame = await newGame.save();
    this.logger.log(`Created game with id: ${savedGame._id}`);
    return savedGame;
  }

  async update(
    id: string,
    updateGameDto: Partial<CreateGameDto>
  ): Promise<Game> {
    this.logger.log(`Updating game with id: ${id}`);
    const updatedGame = await this.gameModel
      .findByIdAndUpdate(id, updateGameDto, { new: true })
      .exec();
    this.logger.log(`Updated game with id: ${updatedGame._id}`);
    return updatedGame;
  }

  async remove(id: string): Promise<Game> {
    this.logger.log(`Removing game with id: ${id}`);
    const removedGame = await this.gameModel.findByIdAndDelete(id).exec();
    this.logger.log(`Removed game with id: ${removedGame._id}`);
    return removedGame;
  }
}
