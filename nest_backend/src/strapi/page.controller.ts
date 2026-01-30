import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { StrapiService } from './strapi.service';

@ApiTags('pages')
@Controller('api/pages')
export class PageController {
    constructor(private readonly strapiService: StrapiService) { }

    @Get()
    @ApiOperation({ summary: 'Get pages from Strapi' })
    @ApiQuery({ name: 'slug', required: false, type: String, description: 'Page slug' })
    @ApiQuery({ name: 'locale', required: false, type: String, description: 'Locale (e.g., en, es)' })
    @ApiQuery({ name: 'region', required: false, type: String, description: 'User region (e.g., US, CA)' })
    @ApiQuery({ name: 'hasConsent', required: false, type: String, description: 'User consent status (true/false)' })
    @ApiQuery({ name: 'populate', required: false, type: String, description: 'Populate fields (e.g., deep)' })
    @ApiResponse({ status: 200, description: 'Returns the page content.' })
    async findAll(@Query() query: any) {
        const strapiParams: any = { ...query };

        if (query.slug) {
            strapiParams.filters = {
                slug: {
                    $eq: query.slug,
                },
            };
            delete strapiParams.slug;
        }

        return this.strapiService.getPages(strapiParams);
    }
}

