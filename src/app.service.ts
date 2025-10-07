import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(private readonly configService: ConfigService) {}

  getHello(): string {
    const appName = this.configService.get<string>('app.name');
    return `Hello from ${appName}!`;
  }

  getHealth() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: this.configService.get<string>('app.name'),
      environment: this.configService.get<string>('app.nodeEnv'),
      version: '1.0.0',
    };
  }
}
