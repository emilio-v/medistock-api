import { Controller, Get, Version } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiVersion } from './common/constants/api-versions';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('health')
  @Version(ApiVersion.V1)
  getHealth() {
    return this.appService.getHealth();
  }
}
