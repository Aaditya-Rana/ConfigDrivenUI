import { factories } from '@strapi/strapi';

function checkVisibility(rules: any, context: any): boolean {
    if (!rules) return true;
    if (rules.enabled === false) return false;

    if (rules.requiresConsent && context.hasConsent !== 'true') return false;

    if (rules.regions && Array.isArray(rules.regions) && rules.regions.length > 0) {
        const userRegion = context.region?.toUpperCase();
        const allowedRegions = rules.regions.map((r: string) => r.toUpperCase());
        if (!userRegion || !allowedRegions.includes(userRegion)) return false;
    }

    const now = new Date();

    if (rules.startTime) {
        const start = new Date(rules.startTime);
        if (now < start) return false;
    }

    if (rules.endTime) {
        const end = new Date(rules.endTime);
        if (now > end) return false;
    }

    return true;
}

export default factories.createCoreController('api::page.page', ({ strapi }) => ({
    async find(ctx) {
        const { data, meta } = await super.find(ctx);

        if (!data) return { data, meta };

        const userContext = {
            region: ctx.query.region as string,
            language: ctx.query.language as string,
            hasConsent: ctx.query.hasConsent as string,
        };


        const filteredData = (Array.isArray(data) ? data : [data]).filter((page: any) => {

            const pageRules = page.visibilityRules;
            if (!checkVisibility(pageRules, userContext)) {
                return false;
            }


            if (page.sections && Array.isArray(page.sections)) {
                page.sections = page.sections.filter((section: any) => {
                    return checkVisibility(section.visibilityRules, userContext);
                });
            }

            return true;
        });

        return { data: filteredData, meta };
    }
}));
