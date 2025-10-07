import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from 'src/app.controller';
import { AppService } from 'src/app.service';
import appConfig from 'src/config/app.config';
import databaseConfig from 'src/config/database.config';
import jwtConfig from 'src/config/jwt.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, jwtConfig, appConfig],
      envFilePath: ['.env.local', '.env'],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
