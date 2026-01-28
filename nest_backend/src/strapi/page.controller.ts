import { Controller, Get, Query } from '@nestjs/common';
import { StrapiService } from './strapi.service';

@Controller('api/pages')
export class PageController {
    constructor(private readonly strapiService: StrapiService) { }

    @Get()
    async findAll(@Query() query: any) {
        // Proxy the query parameters (slug, locale, region, etc.) directly to Strapi
        return this.strapiService.getPages(query);
    }
}

