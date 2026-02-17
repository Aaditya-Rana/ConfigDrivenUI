import { Body, Controller, Get, Param, Post, NotFoundException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger';
import { JourneyService } from './journey.service';

@ApiTags('journey')
@Controller('api/journey')
export class JourneyController {
    constructor(private readonly journeyService: JourneyService) { }

    @Get(':slug/start')
    @ApiOperation({ summary: 'Start a journey by slug' })
    async startJourney(@Param('slug') slug: string) {
        const journey = await this.journeyService.getJourneyBySlug(slug);
        return {
            journeyId: journey.id,
            journeyName: journey.name,
            screen: journey.startScreen
        };
    }

    @Post('next')
    @ApiOperation({ summary: 'Get next screen based on answers' })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                currentScreenDocumentId: { type: 'string' },
                answers: {
                    type: 'object',
                    additionalProperties: true,
                    example: { region: 'US', language: 'en' }
                }
            }
        }
    })
    async getNextScreen(@Body() body: { currentScreenDocumentId: string, answers: Record<string, any> }) {
        return await this.journeyService.getNextScreen(body.currentScreenDocumentId, body.answers);
    }

    @Get(':slug/graph')
    @ApiOperation({ summary: 'Get full journey graph for visualization' })
    async getJourneyGraph(@Param('slug') slug: string) {
        return this.journeyService.getJourneyGraph(slug);
    }
}
