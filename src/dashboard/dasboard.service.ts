import { Injectable, Logger } from '@nestjs/common';
import { GameService } from 'src/games/game.service';
import { User } from 'src/user/schemas/user.schemas';
import { UserService } from 'src/user/user.service';

@Injectable()
export class DashboardService {
  private readonly logger = new Logger(DashboardService.name);

  constructor(
    private readonly userService: UserService,
    private readonly gameService: GameService
  ) {}

  /**
   * Retrieves the total number of users.
   * @returns {Promise<number>} A promise that resolves to the total number of users.
   */
  async getTotalUsers(): Promise<number> {
    this.logger.log('Fetching total number of users');
    const users = await this.userService.getAllUsers();
    this.logger.log(`Total users fetched: ${users.length}`);
    return users.length;
  }

  /**
   * Retrieves the total number of games.
   * @returns {Promise<number>} A promise that resolves to the total number of games.
   */
  async getTotalGames(): Promise<number> {
    this.logger.log('Fetching total number of games');
    const games = await this.gameService.findAll();
    this.logger.log(`Total games fetched: ${games.length}`);
    return games.length;
  }

  /**
   * Retrieves the number of games per user.
   * @returns {Promise<{ userId: string; gameCount: number }[]>} A promise that resolves to an array of objects containing userId and gameCount.
   */
  async getGamesPerUser(): Promise<{ userId: string; gameCount: number }[]> {
    this.logger.log('Fetching number of games per user');
    const users = await this.userService.getAllUsers();
    const gamesPerUser = await Promise.all(
      users.map(async (user: User) => {
        const games = await this.gameService.findByUser(user._id);
        return {
          userId: user._id,
          userName: user.nome,
          userImage: user.picture,
          gameCount: games.length,
          timePlayed: games.reduce((acc, game) => acc + game.hours, 0),
        };
      })
    );
    this.logger.log('Number of games per user fetched');
    return gamesPerUser;
  }

  /**
   * Retrieves the distribution of games by status.
   * @returns {Promise<{ status: string; count: number }[]>} A promise that resolves to an array of objects containing status and count.
   */
  async getGameStatusDistribution(): Promise<
    { status: string; count: number }[]
  > {
    this.logger.log('Fetching game status distribution');
    const games = await this.gameService.findAll();
    const statusDistribution = games.reduce((acc, game) => {
      acc[game.status] = (acc[game.status] || 0) + 1;
      return acc;
    }, {});
    this.logger.log('Game status distribution fetched');
    return Object.keys(statusDistribution).map((status) => ({
      status,
      count: statusDistribution[status],
    }));
  }

  /**
   * Retrieves the games that users are currently playing (Status = "Em andamento").
   * If a user has more than one game in progress, it returns the most recently updated one.
   * If the game does not have an updatedAt field, it returns the first game in progress found.
   * @returns {Promise<{ userId: string; userName: string; game: any }[]>} A promise that resolves to an array of objects containing userId, userName, and the game in progress.
   */
  async getCurrentPlayingGames(): Promise<
    { userId: string; userName: string; game: any }[]
  > {
    this.logger.log('Fetching current playing games');
    const users = await this.userService.getAllUsers();
    const currentPlayingGames = await Promise.all(
      users.map(async (user: User) => {
        const games = await this.gameService.findByUser(user._id);
        const inProgressGames = games.filter(
          (game) => game.status === 'Progresso'
        );
        if (inProgressGames.length > 0) {
          const mostRecentGame = inProgressGames.reduce((latest, game) => {
            if (!latest.updatedAt) return game;
            if (!game.updatedAt) return latest;
            return new Date(game.updatedAt) > new Date(latest.updatedAt)
              ? game
              : latest;
          }, inProgressGames[0]);
          return {
            userId: user._id,
            userName: user.nome,
            game: mostRecentGame,
          };
        }
        return null;
      })
    );
    this.logger.log('Current playing games fetched');
    return currentPlayingGames.filter((game) => game !== null);
  }

  /**
   * Retrieves all dashboard information.
   * @returns {Promise<any>} A promise that resolves to an object containing all dashboard information.
   */
  async getDashboardData(): Promise<any> {
    this.logger.log('Fetching all dashboard data');
    const totalUsers = await this.getTotalUsers();
    const totalGames = await this.getTotalGames();
    const gamesPerUser = await this.getGamesPerUser();
    const gameStatusDistribution = await this.getGameStatusDistribution();
    const currentPlayingGames = await this.getCurrentPlayingGames();
    this.logger.log('All dashboard data fetched');

    return {
      totalUsers,
      totalGames,
      gamesPerUser,
      gameStatusDistribution,
      currentPlayingGames,
    };
  }
}
