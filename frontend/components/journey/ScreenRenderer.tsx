import React, { useState } from 'react';
import { Screen } from '../../lib/journey';
import { QuestionBlock } from './QuestionBlock';
import { Hero } from '../sections/Hero';

interface Props {
    screen: Screen;
    onNext: (answers: Record<string, any>) => void;
    initialAnswers?: Record<string, any>;
    loading: boolean;
}

export function ScreenRenderer({ screen, onNext, initialAnswers = {}, loading }: Props) {
    const [localAnswers, setLocalAnswers] = useState<Record<string, any>>({});

    // Merge previous answers with local changes
    const currentAnswers = { ...initialAnswers, ...localAnswers };

    const handleAnswer = (variable: string, value: any) => {
        setLocalAnswers((prev) => ({ ...prev, [variable]: value }));
    };

    // Find if there are questions on this screen
    const questions = screen.blocks?.filter((b: any) => b.__component === 'shared.question') || [];

    // Check if all questions on this screen are answered
    const isComplete = questions.every((q: any) => {
        const value = currentAnswers[q.variableName];
        if (value === undefined || value === null || value === '') return false;
        if (Array.isArray(value) && value.length === 0) return false;
        return true;
    });

    const handleSubmit = () => {
        if (isComplete) {
            onNext(localAnswers);
        }
    };

    const handleHeroClick = () => {
        if (screen.slug === 'welcome-cardfinder') {
            onNext({ ready: 'yes' });
        } else {
            handleSubmit();
        }
    };

    return (
        <div className="max-w-2xl mx-auto py-12 px-6">
            <h1 className="text-3xl font-bold mb-8 text-center">{screen.title}</h1>

            <div className="space-y-8">
                {screen.blocks?.map((block: any, index: number) => {
                    if (block.__component === 'shared.question') {
                        return (
                            <QuestionBlock
                                key={index}
                                question={block}
                                onAnswer={handleAnswer}
                                currentValue={currentAnswers[block.variableName]}
                            />
                        );
                    }
                    if (block.__component === 'sections.hero') {
                        return (
                            <div key={index} className="-mx-6">
                                <Hero
                                    {...block}
                                    onCtaClick={handleHeroClick}
                                    className="!h-auto !py-12 bg-transparent shadow-none"
                                />
                            </div>
                        );
                    }
                    return null;
                })}
            </div>

            <div className="mt-10 flex justify-end">
                <button
                    onClick={handleSubmit}
                    disabled={!isComplete || loading}
                    className={`px-8 py-3 rounded-full font-bold text-white transition-all transform ${isComplete && !loading
                        ? 'bg-blue-600 hover:bg-blue-700 hover:scale-105 shadow-lg'
                        : 'bg-gray-300 cursor-not-allowed'
                        }`}
                >
                    {loading ? 'Processing...' : 'Continue'}
                </button>
            </div>
        </div>
    );
}
