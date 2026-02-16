import { Module } from '@nestjs/common';
import { JourneyService } from './journey.service';
import { JourneyController } from './journey.controller';
import { StrapiModule } from '../strapi/strapi.module';

@Module({
    imports: [StrapiModule],
    controllers: [JourneyController],
    providers: [JourneyService],
})
export class JourneyModule { }
