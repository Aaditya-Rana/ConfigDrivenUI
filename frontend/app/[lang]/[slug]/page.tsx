import { getPageBySlug, UserContext } from '../../../lib/strapi';
import { SectionRenderer } from '../../../components/SectionRenderer';
import { notFound } from 'next/navigation';

export default async function DynamicPage({
    params,
    searchParams,
}: {
    params: Promise<{ slug: string; lang: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const { slug, lang } = await params;
    const searchParamsValue = await searchParams;

    const userContext = {
        region: typeof searchParamsValue.region === 'string' ? searchParamsValue.region : undefined,
        language: typeof searchParamsValue.language === 'string' ? searchParamsValue.language : undefined,
        hasConsent: searchParamsValue.consent === 'true',
    };

    const page = await getPageBySlug(slug, lang, userContext);

    const frontendUserContext = {
        ...userContext,
        currentLocale: lang,
    };

    if (!page) {
        notFound();
    }


    return (
        <main>
            <SectionRenderer sections={page.sections} userContext={frontendUserContext} />
        </main>
    );
}
