import { getPageBySlug } from '../../lib/strapi';
import { SectionRenderer } from '../../components/SectionRenderer';
import { UserContext, checkVisibility } from '../../lib/visibility';

export default async function HomePage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { lang } = await params;
  const searchParamsValue = await searchParams;
  const page = await getPageBySlug('home', lang);

  const userContext: UserContext = {
    region: typeof searchParamsValue.region === 'string' ? searchParamsValue.region : undefined,
    language: typeof searchParamsValue.language === 'string' ? searchParamsValue.language : undefined,
    hasConsent: searchParamsValue.consent === 'true',
    currentLocale: lang,
  };

  if (!page) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center">
        <h1 className="text-4xl font-bold mb-4 text-gray-800">Welcome</h1>
        <p className="text-lg text-gray-600 max-w-md">
          It looks like the "Home" page content hasn't been created in Strapi yet.
          Please create a page with slug "home".
        </p>
        <a href="http://localhost:1337/admin" target="_blank" className="mt-6 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
          Go to Admin
        </a>
      </div>
    );
  }

  if (!checkVisibility(page.visibilityRules, userContext)) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-400">Page Disabled</h1>
          <p className="mt-2 text-gray-500">
            This page is not available in your region/language settings.
          </p>
        </div>
      </div>
    );
  }

  return (
    <main>
      <SectionRenderer sections={page.sections} userContext={userContext} />
    </main>
  );
}
