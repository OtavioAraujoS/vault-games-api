import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateGameDto } from './dto/create-game.dto';
import { Game, GameDocument } from './schemas/game.schemas';

@Injectable()
export class GameService {
  constructor(@InjectModel(Game.name) private gameModel: Model<GameDocument>) {}

  async findAll(): Promise<Game[]> {
    return this.gameModel.find().exec();
  }

  async findByUser(userId: string): Promise<Game[]> {
    return this.gameModel.find({ userId }).exec();
  }

  async create(createGameDto: CreateGameDto): Promise<Game> {
    const newGame = new this.gameModel(createGameDto);
    return newGame.save();
  }

  async update(
    id: string,
    updateGameDto: Partial<CreateGameDto>
  ): Promise<Game> {
    return this.gameModel
      .findByIdAndUpdate(id, updateGameDto, { new: true })
      .exec();
  }

  async remove(id: string): Promise<Game> {
    return this.gameModel.findByIdAndDelete(id).exec();
  }
}
