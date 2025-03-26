import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
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

  async findByUser(userId: string, status?: string): Promise<Game[]> {
    this.logger.log(`Fetching games for user: ${userId}`);
    const filter: any = { userId };
    if (status) {
      filter.status = status;
    }
    const games = await this.gameModel.find(filter).exec();
    this.logger.log(`Found ${games.length} games for user: ${userId}`);
    return games;
  }

  async findById(id: string): Promise<Game> {
    this.logger.log(`Fetching game with id: ${id}`);
    const game = await this.gameModel.findById(id).exec();
    if (!game) {
      this.logger.error(`Game with id: ${id} not found`);
      throw new NotFoundException(`Game with id: ${id} not found`);
    }
    this.logger.log(`Found game with id: ${game._id}`);
    return game;
  }

  async getLastGamesUpdated(): Promise<Game[]> {
    try {
      this.logger.log('Fetching last games updated');
      const games = await this.gameModel
        .find({}, { _id: 1, nome: 1, updatedAt: 1 })
        .sort({ updatedAt: -1 })
        .limit(5)
        .exec();

      if (!games || games.length === 0) {
        this.logger.warn('No games found');
        return [];
      }

      this.logger.log(`Found ${games.length} games`);
      return games;
    } catch (error) {
      this.logger.error(`Error fetching games: ${error.message}`, error.stack);
      throw new BadRequestException(
        'Error fetching games. Please try again later.'
      );
    }
  }

  async create(createGameDto: CreateGameDto): Promise<Game> {
    this.logger.log('Creating a new game');

    const requiredFields = ['nome', 'description', 'image', 'userId'];
    for (const field of requiredFields) {
      if (!createGameDto[field]) {
        this.logger.error(`Missing required field: ${field}`);
        throw new BadRequestException(`Missing required field: ${field}`);
      }
    }

    const validStatuses = ['Pendente', 'Progresso', 'Pausado', 'Completo'];
    if (createGameDto.status && !validStatuses.includes(createGameDto.status)) {
      this.logger.error(`Invalid status: ${createGameDto.status}`);
      throw new BadRequestException(`Invalid status: ${createGameDto.status}`);
    }

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

    const validStatuses = ['Pendente', 'Progresso', 'Pausado', 'Completo'];
    if (updateGameDto.status && !validStatuses.includes(updateGameDto.status)) {
      this.logger.error(`Invalid status: ${updateGameDto.status}`);
      throw new BadRequestException(`Invalid status: ${updateGameDto.status}`);
    }

    const updatedGame = await this.gameModel
      .findByIdAndUpdate(id, updateGameDto, { new: true })
      .exec();
    if (!updatedGame) {
      this.logger.error(`Game with id: ${id} not found`);
      throw new BadRequestException(`Game with id: ${id} not found`);
    }
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
