import React from 'react';
import Link from 'next/link';
import { LinkSection as LinkSectionType } from '../../lib/strapi';

export function LinkSection({ label, url, linkType, openInNewTab }: LinkSectionType) {
    const target = openInNewTab ? '_blank' : '_self';
    const isExternal = linkType === 'external';

    const content = (
        <>
            {label}
            {isExternal && (
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
            )}
        </>
    );

    const className = "block px-8 py-4 bg-white rounded-lg text-lg font-bold text-gray-900 hover:bg-gray-50 transition-colors flex items-center gap-3";

    return (
        <section className="py-16 bg-white border-y border-gray-100">
            <div className="container mx-auto text-center px-4">
                <div className="inline-block p-1 rounded-xl bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500">
                    {isExternal ? (
                        <a
                            href={url}
                            target={target}
                            className={className}
                            rel={target === '_blank' ? "noopener noreferrer" : undefined}
                        >
                            {content}
                        </a>
                    ) : (
                        <Link href={url} className={className} target={target}>
                            {content}
                        </Link>
                    )}
                </div>
            </div>
        </section>
    );
}
