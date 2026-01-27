const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

export async function fetchAPI(path: string) {
    const requestUrl = `${STRAPI_URL}/api${path}`;
    const response = await fetch(requestUrl, { cache: 'no-store' });
    if (!response.ok) {
        console.warn(`API Error: ${response.status} ${response.statusText} at ${path}`);
        return null;
    }
    return response.json();
}

interface ApiUserContext {
    region?: string;
    language?: string;
    hasConsent?: boolean;
}

export async function getPageBySlug(slug: string, locale: string = 'en', context?: ApiUserContext) {
    const query = new URLSearchParams({
        'filters[slug][$eq]': slug,
        'locale': locale,
        'populate[sections][populate]': '*',
        'populate[visibilityRules]': '*',
    });

    if (context?.region) query.append('region', context.region);
    if (context?.language) query.append('language', context.language);
    if (context?.hasConsent) query.append('hasConsent', 'true');

    const data = await fetchAPI(`/pages?${query.toString()}`);
    return data?.data?.[0] || null;
}

// Types
export interface UserContext {
    region?: string;
    language?: string;
    hasConsent?: boolean;
    currentLocale?: string;
}

export interface VisibilityRules {
    id: number;
    enabled: boolean;
    requiresConsent: boolean;
    regions?: string[];
    languages?: string[];
}

export interface BaseSection {
    id: number;
    __component: string;
    visibilityRules?: VisibilityRules;
}

export interface HeroSection extends BaseSection {
    __component: 'sections.hero';
    heading: string;
    subheading: string;
    ctaText: string;
    ctaLink: string;
    backgroundImage?: {
        data: {
            url: string;
        } | null;
    };
}

export interface Card {
    id: number;
    title: string;
    description: string;
    link: string;
}

export interface CardListSection extends BaseSection {
    __component: 'sections.card-list';
    title: string;
    cards: Card[];
}

export interface LinkSection extends BaseSection {
    __component: 'sections.link-section';
    label: string;
    url: string;
    linkType: 'internal' | 'external';
    openInNewTab: boolean;
}

export type Section = HeroSection | CardListSection | LinkSection;

export interface Page {
    id: number;
    title: string;
    slug: string;
    sections: Section[];
    visibilityRules?: VisibilityRules;
}
