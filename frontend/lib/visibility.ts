import { VisibilityRules } from './strapi';

export interface UserContext {
    region?: string;
    language?: string;
    hasConsent?: boolean;
    currentLocale?: string; // e.g. 'en', 'es'
}

export function checkVisibility(rules: VisibilityRules | undefined, context: UserContext): boolean {
    if (!rules) return true;

    if (rules.enabled === false) {
        return false;
    }

    if (rules.requiresConsent && !context.hasConsent) {
        return false;
    }

    if (rules.regions && Array.isArray(rules.regions) && rules.regions.length > 0) {
        const userRegion = context.region?.toUpperCase();
        const allowedRegions = rules.regions.map((r: string) => r.toUpperCase());

        if (!userRegion || !allowedRegions.includes(userRegion)) {
            return false;
        }
    }

    if (rules.languages && Array.isArray(rules.languages) && rules.languages.length > 0) {
        const userLang = context.language?.toLowerCase();
        const allowedLangs = rules.languages.map((l: string) => l.toLowerCase());

        if (!userLang || !allowedLangs.includes(userLang)) {
            return false;
        }
    }

    return true;
}
