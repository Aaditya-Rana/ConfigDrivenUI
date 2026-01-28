import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StrapiService } from './strapi/strapi.service';
import { PageController } from './strapi/page.controller';

@Module({
  imports: [HttpModule],
  controllers: [AppController, PageController],
  providers: [AppService, StrapiService],
})
export class AppModule { }
