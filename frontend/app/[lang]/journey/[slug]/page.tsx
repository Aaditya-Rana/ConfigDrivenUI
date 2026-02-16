import React from 'react';
import { JourneyContainer } from '../../../../components/journey/JourneyContainer';

interface Props {
    params: Promise<{
        slug: string;
        lang: string;
    }>;
}

export default async function JourneyPage({ params }: Props) {
    const { slug } = await params;
    return (
        <main className="min-h-screen bg-white">
            <JourneyContainer slug={slug} />
        </main>
    );
}
