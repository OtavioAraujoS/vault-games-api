import { Controller, Get } from '@nestjs/common';
import { DashboardService } from './dasboard.service';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('total-users')
  async getTotalUsers(): Promise<number> {
    return this.dashboardService.getTotalUsers();
  }

  @Get('total-games')
  async getTotalGames(): Promise<number> {
    return this.dashboardService.getTotalGames();
  }

  @Get('games-per-user')
  async getGamesPerUser(): Promise<{ userId: string; gameCount: number }[]> {
    return this.dashboardService.getGamesPerUser();
  }

  @Get('game-status-distribution')
  async getGameStatusDistribution(): Promise<
    { status: string; count: number }[]
  > {
    return this.dashboardService.getGameStatusDistribution();
  }

  @Get('data')
  async getDashboardData(): Promise<any> {
    return this.dashboardService.getDashboardData();
  }
}
