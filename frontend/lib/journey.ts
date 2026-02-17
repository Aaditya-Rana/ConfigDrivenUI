const NEST_API_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:3001';

export type ScreenType = 'question' | 'info' | 'summary';

export interface Option {
    id: number;
    label: string;
    value: string;
}

export interface Question {
    id: number;
    label: string;
    variableName: string;
    type: 'single_choice' | 'multiple_choice' | 'text' | 'number';
    options: Option[];
}

export interface Screen {
    id: number;
    documentId: string;
    title: string;
    slug: string;
    type: ScreenType;
    blocks: any[]; // Dynamic zone content
}

export interface JourneyResponse {
    journeyId: number;
    journeyName: string;
    screen: Screen;
}

export interface NextScreenResponse {
    finished?: boolean;
    message?: string;
    screen?: Screen;
}

export async function startJourney(slug: string): Promise<JourneyResponse | null> {
    try {
        const response = await fetch(`${NEST_API_URL}/api/journey/${slug}/start`, { cache: 'no-store' });
        if (!response.ok) throw new Error('Failed to start journey');
        return await response.json();
    } catch (error) {
        console.error(error);
        return null;
    }
}

export async function getNextScreen(currentScreenDocumentId: string, answers: Record<string, any>): Promise<NextScreenResponse | null> {
    try {
        const response = await fetch(`${NEST_API_URL}/api/journey/next`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ currentScreenDocumentId, answers }),
            cache: 'no-store'
        });

        if (!response.ok) {
            const errorBody = await response.text();
            console.error('Journey API Error:', response.status, errorBody);
            throw new Error(`Failed to get next screen: ${response.status} ${errorBody}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Fetch error:', error);
        return null;
    }
}

export async function getJourneyGraph(slug: string): Promise<{ nodes: any[], edges: any[] } | null> {
    try {
        const response = await fetch(`${NEST_API_URL}/api/journey/${slug}/graph`, { cache: 'no-store' });
        if (!response.ok) throw new Error('Failed to fetch journey graph');
        return await response.json();
    } catch (error) {
        console.error(error);
        return null;
    }
}
