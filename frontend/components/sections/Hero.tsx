import React from 'react';
import Link from 'next/link';
import { HeroSection } from '../../lib/strapi';

export function Hero({ heading, subheading, ctaText, ctaLink, backgroundImage }: HeroSection) {
    const imageUrl = backgroundImage?.data?.url;
    const bgUrl = imageUrl
        ? `url(${imageUrl.startsWith('http') ? imageUrl : `http://localhost:1337${imageUrl}`})`
        : 'none';

    return (
        <section
            className="relative w-full h-[70vh] flex items-center justify-center text-center bg-gray-900 text-white overflow-hidden"
            style={{ backgroundImage: bgUrl, backgroundSize: 'cover', backgroundPosition: 'center' }}
        >
            <div className="absolute inset-0 bg-black/60" />
            <div className="relative z-10 p-8 max-w-5xl mx-auto flex flex-col items-center">
                <h1 className="text-5xl md:text-7xl font-extrabold mb-8 tracking-tight leading-tight drop-shadow-lg">
                    {heading}
                </h1>
                <p className="text-xl md:text-2xl text-gray-100 mb-10 max-w-3xl leading-relaxed drop-shadow-md">
                    {subheading}
                </p>
                {ctaText && ctaLink && (
                    <Link
                        href={ctaLink}
                        className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white transition-all duration-200 bg-blue-600 font-pj rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 hover:bg-blue-700 hover:scale-105 shadow-xl"
                    >
                        {ctaText}
                        <div className="absolute -inset-3 rounded-xl bg-blue-400 opacity-20 group-hover:opacity-40 blur-lg transition-opacity duration-200" />
                    </Link>
                )}
            </div>
        </section>
    );
}
