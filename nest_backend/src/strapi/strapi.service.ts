import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class StrapiService {
    private readonly logger = new Logger(StrapiService.name);
    private readonly STRAPI_URL = 'http://localhost:1337/api';

    constructor(private readonly httpService: HttpService) { }

    async getPages(params: any) {
        try {
            this.logger.log(`Fetching pages from Strapi with params: ${JSON.stringify(params)}`);
            const { data } = await lastValueFrom(
                this.httpService.get(`${this.STRAPI_URL}/pages`, { params })
            );
            return data;
        } catch (error) {
            this.logger.error(`Error fetching pages from Strapi: ${error.message}`);
            throw error;
        }
    }
}

