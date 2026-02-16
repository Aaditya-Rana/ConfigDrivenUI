import React from 'react';
import Link from 'next/link';
import { HeroSection } from '../../lib/strapi';

export function Hero({ heading, subheading, ctaText, ctaLink, backgroundImage, onCtaClick, className }: HeroSection & { onCtaClick?: () => void; className?: string }) {
    const imageUrl = backgroundImage?.data?.url;
    const fullImageUrl = imageUrl ? (imageUrl.startsWith('http') ? imageUrl : `http://localhost:1337${imageUrl}`) : null;

    const bgUrl = fullImageUrl ? `url(${fullImageUrl})` : 'none';
    const hasImage = !!fullImageUrl;

    // Defaults: Dark/Overlay if image, Light/Clean if no image
    const baseClasses = hasImage
        ? "relative w-full h-[70vh] flex items-center justify-center text-center bg-gray-900 text-white overflow-hidden"
        : "relative w-full py-20 flex flex-col items-center justify-center text-center bg-gray-50 text-gray-900 overflow-hidden";

    return (
        <section
            className={`${baseClasses} ${className || ''}`}
            style={hasImage ? { backgroundImage: bgUrl, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
        >
            {hasImage && <div className="absolute inset-0 bg-black/60" />}
            <div className="relative z-10 p-8 max-w-5xl mx-auto flex flex-col items-center">
                <h1 className={`text-4xl md:text-6xl font-extrabold mb-6 tracking-tight leading-tight ${hasImage ? 'drop-shadow-lg' : ''}`}>
                    {heading}
                </h1>
                <p className={`text-lg md:text-xl mb-8 max-w-3xl leading-relaxed ${hasImage ? 'text-gray-100 drop-shadow-md' : 'text-gray-600'}`}>
                    {subheading}
                </p>
                {ctaText && (
                    onCtaClick ? (
                        <button
                            onClick={onCtaClick}
                            className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white transition-all duration-200 bg-blue-600 font-pj rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 hover:bg-blue-700 hover:scale-105 shadow-xl"
                        >
                            {ctaText}
                            <div className="absolute -inset-3 rounded-xl bg-blue-400 opacity-20 group-hover:opacity-40 blur-lg transition-opacity duration-200" />
                        </button>
                    ) : (
                        ctaLink && (
                            <Link
                                href={ctaLink}
                                className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white transition-all duration-200 bg-blue-600 font-pj rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 hover:bg-blue-700 hover:scale-105 shadow-xl"
                            >
                                {ctaText}
                                <div className="absolute -inset-3 rounded-xl bg-blue-400 opacity-20 group-hover:opacity-40 blur-lg transition-opacity duration-200" />
                            </Link>
                        )
                    )
                )}
            </div>
        </section>
    );
}
