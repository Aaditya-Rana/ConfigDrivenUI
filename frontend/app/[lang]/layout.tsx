import Link from 'next/link';
import React from 'react';

export default async function LocalizedLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ lang: string }>;
}) {
    const { lang } = await params;

    return (
        <div className="flex flex-col min-h-screen">
            <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex-shrink-0">
                            <Link href={`/${lang}`} className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                Brand<span className="text-gray-900">UI</span>
                            </Link>
                        </div>
                        <nav className="flex space-x-8">
                            <Link href={`/${lang}`} className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">Home</Link>
                            <Link href={`/${lang}/about`} className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">About</Link>
                            <Link href={`/${lang}/help`} className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">Help</Link>
                        </nav>
                    </div>
                </div>
            </header>
            {children}
            <footer className="bg-gray-50 border-t border-gray-200 mt-auto">
                <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 text-center text-gray-500 text-sm">
                    <p>&copy; {new Date().getFullYear()} Config-Driven UI. Built with Next.js & Strapi.</p>
                </div>
            </footer>
        </div>
    );
}
