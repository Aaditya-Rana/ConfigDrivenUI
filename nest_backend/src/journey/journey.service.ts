import { Injectable, NotFoundException, HttpException, HttpStatus } from '@nestjs/common';
import { StrapiService } from '../strapi/strapi.service';

@Injectable()
export class JourneyService {
    constructor(private readonly strapiService: StrapiService) { }

    async getJourneyBySlug(slug: string) {
        const response = await this.strapiService.find('journeys', {
            filters: { slug: { $eq: slug } },
            populate: {
                startScreen: {
                    populate: {
                        blocks: { populate: '*' },
                        transitions: {
                            populate: {
                                targetScreen: true
                            }
                        }
                    }
                }
            }
        });

        if (!response.data || response.data.length === 0) {
            throw new NotFoundException(`Journey with slug '${slug}' not found`);
        }

        return response.data[0];
    }

    async getNextScreen(currentScreenDocumentId: string, answers: Record<string, any>) {
        try {
            const screenResponse = await this.strapiService.find('screens', {
                filters: { documentId: { $eq: currentScreenDocumentId } },
                populate: {
                    transitions: {
                        populate: {
                            targetScreen: true
                        }
                    }
                }
            });

            const screen = screenResponse.data?.[0];
            if (!screen) {
                throw new NotFoundException('Current screen not found');
            }

            const transitions = screen.transitions || [];
            console.log(`[JourneyService] Evaluating ${transitions.length} transitions for screen ${screen.documentId}`);

            for (const transition of transitions) {
                console.log(`[JourneyService] Checking rule: ${transition.field} ${transition.operator} ${transition.value} vs Answer: ${answers[transition.field]}`);
                if (this.evaluateRule(transition, answers)) {
                    if (!transition.targetScreen) {
                        console.error(`[JourneyService] Transition matched but targetScreen is NULL. Transition ID: ${transition.id}`);
                        continue;
                    }
                    console.log(`[JourneyService] Match found! Transitioning to: ${transition.targetScreen.documentId}`);
                    return this.getScreenDetails(transition.targetScreen.documentId);
                }
            }

            return null;

        } catch (e: any) {
            console.error('JourneyService Error:', e);
            throw new HttpException(`Journey Error: ${e.message}`, HttpStatus.BAD_REQUEST);
        }
    }

    async getScreenDetails(documentId: string) {
        const response = await this.strapiService.find('screens', {
            filters: { documentId: { $eq: documentId } },
            populate: {
                blocks: {
                    populate: '*'
                },
                transitions: {
                    populate: {
                        targetScreen: true
                    }
                }
            }
        });
        return response.data[0];
    }

    private evaluateRule(transition: any, answers: Record<string, any>): boolean {
        const { field, operator, value } = transition;
        const userAnswer = answers[field];

        console.log(`[JourneyService] Rule: ${field} ${operator} ${value}`);
        console.log(`[JourneyService] User Answer: ${JSON.stringify(userAnswer)} (Type: ${typeof userAnswer}, IsArray: ${Array.isArray(userAnswer)})`);

        if (userAnswer === undefined || userAnswer === null) {
            console.log('[JourneyService] Answer is undefined/null -> False');
            return false;
        }

        let result = false;

        switch (operator) {
            case 'equals':
                if (Array.isArray(userAnswer)) result = userAnswer.sort().join(',') === value.split(',').sort().join(',');
                else result = userAnswer == value;
                break;
            case 'not_equals':
                if (Array.isArray(userAnswer)) result = userAnswer.sort().join(',') !== value.split(',').sort().join(',');
                else result = userAnswer != value;
                break;
            case 'contains':
                if (Array.isArray(userAnswer)) result = userAnswer.includes(value);
                else result = String(userAnswer).includes(value);
                break;
            case 'not_contains':
                if (Array.isArray(userAnswer)) result = !userAnswer.includes(value);
                else result = !String(userAnswer).includes(value);
                break;
            case 'in':
                const allowedValues = value.split(',').map((v: string) => v.trim());
                if (Array.isArray(userAnswer)) result = userAnswer.some(a => allowedValues.includes(a));
                else result = allowedValues.includes(String(userAnswer));
                break;
            case 'not_in':
                const forbiddenValues = value.split(',').map((v: string) => v.trim());
                if (Array.isArray(userAnswer)) result = !userAnswer.some(a => forbiddenValues.includes(a));
                else result = !forbiddenValues.includes(String(userAnswer));
                break;
            case 'greater_than':
                result = Number(userAnswer) > Number(value);
                break;
            case 'less_than':
                result = Number(userAnswer) < Number(value);
                break;
            case 'greater_than_or_equal':
                result = Number(userAnswer) >= Number(value);
                break;
            case 'less_than_or_equal':
                result = Number(userAnswer) <= Number(value);
                break;
            case 'starts_with':
                result = String(userAnswer).startsWith(value);
                break;
            case 'ends_with':
                result = String(userAnswer).endsWith(value);
                break;
            default:
                result = false;
        }

        console.log(`[JourneyService] Result: ${result}`);
        return result;
    }
}
