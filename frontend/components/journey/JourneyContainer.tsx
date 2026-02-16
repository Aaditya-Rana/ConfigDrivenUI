'use client';

import React, { useState, useEffect } from 'react';
import { Screen, startJourney, getNextScreen } from '../../lib/journey';
import { ScreenRenderer } from './ScreenRenderer';

interface Props {
    slug: string;
}

export function JourneyContainer({ slug }: Props) {
    const [currentScreen, setCurrentScreen] = useState<Screen | null>(null);
    const [answers, setAnswers] = useState<Record<string, any>>({});
    const [history, setHistory] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [finished, setFinished] = useState(false);

    useEffect(() => {
        async function init() {
            setLoading(true);
            const data = await startJourney(slug);
            if (data) {
                setCurrentScreen(data.screen);
            }
            setLoading(false);
        }
        init();
    }, [slug]);

    const handleNext = async (newAnswers: Record<string, any>) => {
        if (!currentScreen) return;

        setLoading(true);
        const updatedAnswers = { ...answers, ...newAnswers };
        setAnswers(updatedAnswers);

        // Push current screen to history
        setHistory([...history, currentScreen.documentId]);

        const next = await getNextScreen(currentScreen.documentId, updatedAnswers);

        if (next?.finished) {
            setFinished(true);
        } else if (next?.screen) {
            setCurrentScreen(next.screen);
        }
        setLoading(false);
    };

    if (loading && !currentScreen) {
        return <div className="flex h-screen items-center justify-center">Loading Journey...</div>;
    }

    if (finished) {
        return (
            <div className="max-w-2xl mx-auto py-24 text-center">
                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                </div>
                <h1 className="text-4xl font-bold mb-4">You're all set!</h1>
                <p className="text-xl text-gray-600 mb-8">Thank you for completing the onboarding.</p>
                <div className="bg-gray-50 p-6 rounded-xl text-left mx-auto max-w-md">
                    <h3 className="font-semibold mb-4 text-gray-900 border-b pb-2">Summary</h3>
                    <dl className="grid grid-cols-2 gap-x-4 gap-y-4">
                        {Object.entries(answers).map(([key, val]) => (
                            <React.Fragment key={key}>
                                <dt className="text-gray-500 capitalize">{key}</dt>
                                <dd className="font-medium text-gray-900">{String(val)}</dd>
                            </React.Fragment>
                        ))}
                    </dl>
                </div>
            </div>
        );
    }

    if (!currentScreen) {
        return <div className="text-center py-20">Journey not found.</div>;
    }

    return (
        <ScreenRenderer
            screen={currentScreen}
            onNext={handleNext}
            initialAnswers={answers}
            loading={loading}
        />
    );
}
