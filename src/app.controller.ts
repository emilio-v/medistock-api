import { Controller, Get, Version } from '@nestjs/common';
import { AppService } from 'src/app.service';
import { ApiVersion } from 'src/common/constants/api-versions';

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
