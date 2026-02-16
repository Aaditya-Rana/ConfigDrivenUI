import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StrapiModule } from './strapi/strapi.module';
import { JourneyModule } from './journey/journey.module';

@Module({
  imports: [StrapiModule, JourneyModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
