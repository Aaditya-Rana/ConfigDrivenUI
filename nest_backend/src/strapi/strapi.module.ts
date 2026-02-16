import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { StrapiService } from './strapi.service';
import { PageController } from './page.controller';

@Module({
    imports: [HttpModule],
    controllers: [PageController],
    providers: [StrapiService],
    exports: [StrapiService], // Export so other modules can use it
})
export class StrapiModule { }
