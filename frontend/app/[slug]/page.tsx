import { getPageBySlug } from '../../lib/strapi';
import { SectionRenderer } from '../../components/SectionRenderer';
import { notFound } from 'next/navigation';
import { UserContext, checkVisibility } from '../../lib/visibility';

export default async function DynamicPage({
    params,
    searchParams,
}: {
    params: Promise<{ slug: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const { slug } = await params;
    const searchParamsValue = await searchParams;
    const page = await getPageBySlug(slug);

    const userContext: UserContext = {
        region: typeof searchParamsValue.region === 'string' ? searchParamsValue.region : undefined,
        language: typeof searchParamsValue.language === 'string' ? searchParamsValue.language : undefined,
        hasConsent: searchParamsValue.consent === 'true',
    };

    if (!page) {
        notFound();
    }

    if (!checkVisibility(page.visibilityRules, userContext)) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <h1 className="text-2xl font-bold text-gray-400">Page is disabled or restricted</h1>
            </div>
        );
    }

    return (
        <main>
            <SectionRenderer sections={page.sections} userContext={userContext} />
        </main>
    );
}
