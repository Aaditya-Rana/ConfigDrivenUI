import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import qs from 'qs';

@Injectable()
export class StrapiService {
    private readonly logger = new Logger(StrapiService.name);
    private readonly STRAPI_URL = process.env.STRAPI_URL ?? 'http://localhost:1337/api';

    constructor(private readonly httpService: HttpService) { }

    async getPages(params: any) {
        return this.find('pages', params);
    }

    async find(resource: string, params: any) {
        try {
            const query = qs.stringify(params, { encodeValuesOnly: true });
            const url = `${this.STRAPI_URL}/${resource}?${query}`;
            this.logger.log(`Fetching ${url}`);
            console.log(`[StrapiService] Generated URL: ${url}`); // Explicit log for debugging

            const response = await fetch(url);
            if (!response.ok) {
                const errorText = await response.text();
                this.logger.error(`Strapi Error: ${response.status} ${response.statusText} - ${errorText}`);
                throw new Error(`Request failed with status ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            this.logger.error(`Error fetching ${resource} from Strapi: ${error.message}`);
            throw error;
        }
    }

    async findOne(resource: string, id: string | number, params: any = {}) {
        try {
            const query = qs.stringify(params, { encodeValuesOnly: true });
            const url = `${this.STRAPI_URL}/${resource}/${id}?${query}`;
            this.logger.log(`Fetching ${url}`);

            const response = await fetch(url);
            if (!response.ok) {
                const errorText = await response.text();
                this.logger.error(`Strapi Error: ${response.status} ${response.statusText} - ${errorText}`);
                throw new Error(`Request failed with status ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            this.logger.error(`Error fetching ${resource}/${id} from Strapi: ${error.message}`);
            throw error;
        }
    }
}

