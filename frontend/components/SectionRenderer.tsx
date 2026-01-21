import React from 'react';
import { Hero } from './sections/Hero';
import { CardList } from './sections/CardList';
import { LinkSection } from './sections/LinkSection';
import { Section } from '../lib/strapi';
import { UserContext, checkVisibility } from '../lib/visibility';

interface Props {
    sections: Section[];
    userContext?: UserContext;
}

export function SectionRenderer({ sections, userContext = {} }: Props) {
    if (!sections || sections.length === 0) return null;

    return (
        <div className="flex flex-col w-full min-h-screen">
            {sections.map((section, index) => {
                if (!checkVisibility(section.visibilityRules, userContext)) {
                    return null;
                }

                switch (section.__component) {
                    case 'sections.hero':
                        return <Hero key={`${section.__component}-${index}`} {...section} />;
                    case 'sections.card-list':
                        return <CardList key={`${section.__component}-${index}`} {...section} />;
                    case 'sections.link-section':
                        return <LinkSection key={`${section.__component}-${index}`} {...section} />;
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
