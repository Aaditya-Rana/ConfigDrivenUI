// Note: Visibility checks are now handled by the backend!
// If a section is in the list, it is visible.
// Sections are rendered via the component registry (lib/componentRegistry).

import React from 'react';
import { renderBlock, BlockProps } from '@/lib/componentRegistry';
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
            {sections.map((section, index) =>
                renderBlock(
                    section.__component,
                    section as unknown as BlockProps,
                    { userContext, currentLocale: userContext?.currentLocale },
                    `section-${section.__component}-${index}`
                )
            )}
        </div>
    );
}
