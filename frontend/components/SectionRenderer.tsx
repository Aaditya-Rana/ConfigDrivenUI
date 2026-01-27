// Note: Visibility checks are now handled by the backend!
// If a section is in the list, it is visible.

import React from 'react';
import { Hero } from './sections/Hero';
import { CardList } from './sections/CardList';
import { LinkSection } from './sections/LinkSection';
import { Section, UserContext } from '../lib/strapi';

export function SectionRenderer({
    sections,
    userContext
}: {
    sections: Section[],
    userContext: UserContext
}) {
    if (!sections?.length) return null;

    return (
        <div className="flex flex-col gap-16 pb-20">
            {sections.map((section, index) => {
                switch (section.__component) {
                    case 'sections.hero':
                        return <Hero key={`${section.__component}-${index}`} {...section} />;
                    case 'sections.card-list':
                        return <CardList key={`${section.__component}-${index}`} {...section} currentLocale={userContext?.currentLocale} />;
                    case 'sections.link-section':
                        return <LinkSection key={`${section.__component}-${index}`} {...section} currentLocale={userContext?.currentLocale} />;
                    default:
                        const unknownSection = section as any;
                        return (
                            <div key={index} className="py-12 bg-gray-100 text-center border-b border-gray-200">
                                <p className="text-gray-500 font-mono text-sm">Unknown Component: {unknownSection.__component}</p>
                            </div>
                        );
                }
            })}
        </div>
    );
}
