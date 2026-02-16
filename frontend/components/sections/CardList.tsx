import React from 'react';
import Link from 'next/link';
import { CardListSection } from '../../lib/strapi';

interface Props extends CardListSection {
    currentLocale?: string;
}

export function CardList({ title, cards, currentLocale }: Props) {
    const getLocalizedLink = (link: string) => {
        if (!link || link.startsWith('http') || link.startsWith('#')) return link;
        if (currentLocale && !link.startsWith(`/${currentLocale}`)) {
            return `/${currentLocale}${link.startsWith('/') ? '' : '/'}${link}`;
        }
        return link;
    };

    console.log(cards);

    return (
        <section className="py-24 px-4 bg-gray-50">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">{title}</h2>
                    <div className="w-24 h-1 bg-blue-600 mx-auto mt-6 rounded-full"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {cards?.map((card) => (
                        <div key={card.id} className="group relative bg-white rounded-3xl p-8 hover:bg-gray-50 transition-all duration-300 border border-gray-100 hover:border-blue-100 shadow-sm hover:shadow-2xl">
                            {(() => {
                                const imgData = 'data' in (card.image || {})
                                    ? (card.image as { data: any })?.data
                                    : (card.image as any);

                                if (!imgData?.url) return null;

                                return (
                                    <div className="relative h-48 w-full mb-6 rounded-2xl overflow-hidden">
                                        <img
                                            src={imgData.url.startsWith('http') ? imgData.url : `http://localhost:1337${imgData.url}`}
                                            alt={imgData.alternativeText || card.title}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                    </div>
                                );
                            })()}

                            <h3 className="text-2xl font-bold mb-4 text-gray-900 group-hover:text-blue-600 transition-colors">{card.title}</h3>
                            <p className="text-gray-600 mb-8 leading-relaxed text-lg">{card.description}</p>

                            <div className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-tl from-blue-50 to-transparent rounded-tl-full -mr-4 -mb-4 opacity-50 group-hover:opacity-100 transition-opacity"></div>


                            {card.link && (
                                <Link href={getLocalizedLink(card.link)} className="inline-flex items-center text-blue-600 font-semibold group-hover:translate-x-1 transition-transform">
                                    Learn more
                                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                                </Link>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
