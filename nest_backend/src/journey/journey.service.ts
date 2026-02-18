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
                            targetScreen: true,
                            conditions: true
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
                console.log(`[JourneyService] Evaluating transition ID: ${transition.id}`);
                if (this.evaluateTransition(transition, answers)) {
                    if (!transition.targetScreen) {
                        console.error(`[JourneyService] Transition matched but targetScreen is NULL. Transition ID: ${transition.id}`);
                        continue;
                    }
                    console.log(`[JourneyService] Match found! Transitioning to: ${transition.targetScreen.documentId}`);
                    const nextScreen = await this.getScreenDetails(transition.targetScreen.documentId);
                    return { screen: nextScreen };
                }
            }

            console.log('[JourneyService] No transition matched. Journey Finished.');
            return { finished: true };

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
                        targetScreen: true,
                        conditions: true
                    }
                }
            }
        });
        return response.data[0];
    }

    async getJourneyGraph(slug: string) {
        const journey = await this.getJourneyBySlug(slug);
        const startScreenId = journey.startScreen?.documentId;

        if (!startScreenId) {
            return { nodes: [], edges: [] };
        }

        const nodes = new Map<string, any>();
        const edges: any[] = [];
        const queue = [startScreenId];
        const visited = new Set<string>();

        while (queue.length > 0) {
            const currentId = queue.shift();
            if (visited.has(currentId)) continue;
            visited.add(currentId);

            const screen = await this.getScreenDetails(currentId);
            if (!screen) continue;

            nodes.set(currentId, {
                id: currentId,
                // Prefer explicit title, then slug, then a generic fallback
                label: screen.title || screen.slug || 'Untitled Screen',
                type: 'default',
                data: {
                    blocks: screen.blocks
                }
            });

            if (screen.transitions) {
                for (const t of screen.transitions) {
                    const targetId = t.targetScreen?.documentId;

                    let label = '';
                    const type = t.type || 'AND';
                    const conds = t.conditions || [];

                    if (conds.length === 0) {
                        label = 'Fallback / Always';
                    } else if (conds.length === 1) {
                        const c = conds[0];
                        label = `${c.field} ${c.operator} ${c.value}`;
                    } else {
                        const subLabels = conds.map((c: any) => `(${c.field} ${c.operator} ${c.value})`);
                        label = subLabels.join(`\n${type}\n`);
                    }

                    edges.push({
                        id: `edge-${t.id}`,
                        source: currentId,
                        target: targetId,
                        label: label,
                        data: t
                    });

                    if (targetId && !visited.has(targetId)) {
                        queue.push(targetId);
                    }
                }
            }
        }

        return {
            nodes: Array.from(nodes.values()),
            edges: edges
        };
    }

    private evaluateTransition(transition: any, answers: Record<string, any>): boolean {
        const type = transition.type || 'AND';
        const conditions = transition.conditions || [];

        console.log(`[JourneyService] Logic Type: ${type}, Conditions: ${conditions.length}`);

        if (conditions.length === 0) {
            // If no conditions, it's a fallback/always-pass transition (unless it was meant to be conditional)
            // But usually fallback has NO conditions.
            return true;
        }

        if (type === 'AND') {
            return conditions.every((cond: any) => this.checkCondition(cond, answers));
        }

        if (type === 'OR') {
            return conditions.some((cond: any) => this.checkCondition(cond, answers));
        }

        return false;
    }

    private checkCondition(rule: any, answers: Record<string, any>): boolean {
        const { field, operator, value } = rule;
        const userAnswer = answers[field];

        console.log(`[JourneyService] Checking: ${field} ${operator} ${value} vs ${JSON.stringify(userAnswer)}`);

        if (userAnswer === undefined || userAnswer === null) return false;

        let result = false;

        switch (operator) {
            case 'equals':
                if (Array.isArray(userAnswer)) result = userAnswer.sort().join(',') === value.split(',').sort().join(',');
                else result = String(userAnswer) == String(value);
                break;
            case 'not_equals':
                if (Array.isArray(userAnswer)) result = userAnswer.sort().join(',') !== value.split(',').sort().join(',');
                else result = String(userAnswer) != String(value);
                break;
            case 'in':
                const allowed = value.split(',').map((v: string) => v.trim());
                if (Array.isArray(userAnswer)) result = userAnswer.some(a => allowed.includes(String(a)));
                else result = allowed.includes(String(userAnswer));
                break;
            case 'not_in':
                const forbidden = value.split(',').map((v: string) => v.trim());
                if (Array.isArray(userAnswer)) result = !userAnswer.some(a => forbidden.includes(String(a)));
                else result = !forbidden.includes(String(userAnswer));
                break;
            case 'contains':
                if (Array.isArray(userAnswer)) result = userAnswer.map(String).includes(value);
                else result = String(userAnswer).includes(value);
                break;
            case 'not_contains':
                if (Array.isArray(userAnswer)) result = !userAnswer.map(String).includes(value);
                else result = !String(userAnswer).includes(value);
                break;

            case 'intersects':
                const targets = value.split(',').map((v: string) => v.trim());
                if (Array.isArray(userAnswer)) {
                    result = userAnswer.some((a: any) => targets.includes(String(a)));
                } else {
                    result = targets.includes(String(userAnswer));
                }
                break;

            case 'contains_all':
                const required = value.split(',').map((v: string) => v.trim());
                if (Array.isArray(userAnswer)) {
                    const userStringArray = userAnswer.map(String);
                    result = required.every(req => userStringArray.includes(req));
                } else {
                    result = required.length === 1 && String(userAnswer) === required[0];
                }
                break;

            case 'equals_set':
                const setTargets = value.split(',').map((v: string) => v.trim()).sort();
                if (Array.isArray(userAnswer)) {
                    const userSet = userAnswer.map(String).sort();
                    result = JSON.stringify(setTargets) === JSON.stringify(userSet);
                } else {
                    result = setTargets.length === 1 && setTargets[0] === String(userAnswer);
                }
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

        console.log(`[JourneyService] Rule Result: ${result}`);
        return result;
    }
}
