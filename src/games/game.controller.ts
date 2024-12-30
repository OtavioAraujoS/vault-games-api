import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CreateGameDto } from './dto/create-game.dto';
import { GameService } from './game.service';

@Controller('games')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Get()
  async getAllGames() {
    return this.gameService.findAll();
  }

  @Get('user/:userId')
  async getGamesByUser(@Param('userId') userId: string) {
    return this.gameService.findByUser(userId);
  }

  @Post()
  async createGame(@Body() createGameDto: CreateGameDto) {
    return this.gameService.create(createGameDto);
  }

  @Put('/:id')
  async updateGame(
    @Param('id') id: string,
    @Body() createGameDto: CreateGameDto
  ) {
    return this.gameService.update(id, createGameDto);
  }

  @Delete('/:id')
  async removeGame(@Param('id') id: string) {
    return this.gameService.remove(id);
  }
}
