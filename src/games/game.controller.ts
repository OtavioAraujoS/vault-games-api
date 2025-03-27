import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
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

  @Get('last-updated')
  async getLastGamesUpdated() {
    return this.gameService.getLastGamesUpdated();
  }

  @Get('/:id')
  async getGameById(@Param('id') id: string) {
    return this.gameService.findById(id);
  }

  @Get('user/:userId')
  async getGamesByUser(
    @Param('userId') userId: string,
    @Query('status') status?: string
  ) {
    return this.gameService.findByUser(userId, status);
  }

  @Get('last-updated/user/:userId')
  async getLastGamesUpdatedByUser(@Param('userId') userId: string) {
    return this.gameService.getLastGamesUpdatedByUser(userId);
  }

  @Get('distribution/user/:userId')
  async getGamesDistributionByUser(@Param('userId') userId: string) {
    return this.gameService.getGameDistributionByUser(userId);
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
