import React from 'react';
import { Question } from '../../lib/journey';

interface Props {
    question: Question;
    onAnswer: (variable: string, value: any) => void;
    currentValue?: any;
}

export function QuestionBlock({ question, onAnswer, currentValue }: Props) {
    if (question.type === 'single_choice') {
        return (
            <div className="space-y-4">
                <h3 className="text-xl font-semibold mb-4">{question.label}</h3>
                <div className="grid gap-3">
                    {question.options?.map((opt) => (
                        <button
                            key={opt.id}
                            onClick={() => onAnswer(question.variableName, opt.value)}
                            className={`w-full p-4 text-left border rounded-xl transition-all ${currentValue === opt.value
                                ? 'border-blue-500 bg-blue-50 text-blue-700 ring-2 ring-blue-500 ring-opacity-50'
                                : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                                }`}
                        >
                            <span className="font-medium">{opt.label}</span>
                        </button>
                    ))}
                </div>
            </div>
        );
    }

    if (question.type === 'multiple_choice') {
        const selectedValues = Array.isArray(currentValue) ? currentValue : [];

        const toggleOption = (value: string) => {
            const newValues = selectedValues.includes(value)
                ? selectedValues.filter((v: any) => v !== value)
                : [...selectedValues, value];
            onAnswer(question.variableName, newValues);
        };

        return (
            <div className="space-y-4">
                <h3 className="text-xl font-semibold mb-4">{question.label}</h3>
                <div className="grid gap-3">
                    {question.options?.map((opt) => {
                        const isSelected = selectedValues.includes(opt.value);
                        return (
                            <button
                                key={opt.id}
                                onClick={() => toggleOption(opt.value)}
                                className={`w-full p-4 text-left border rounded-xl transition-all flex items-center justify-between ${isSelected
                                    ? 'border-blue-500 bg-blue-50 text-blue-700 ring-2 ring-blue-500 ring-opacity-50'
                                    : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                                    }`}
                            >
                                <span className="font-medium">{opt.label}</span>
                                {isSelected && (
                                    <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                )}
                            </button>
                        );
                    })}
                </div>
                <p className="text-sm text-gray-500">Select all that apply.</p>
            </div>
        );
    }

    if (question.type === 'text') {
        return (
            <div className="space-y-4">
                <label className="block text-xl font-semibold mb-2">{question.label}</label>
                <input
                    type="text"
                    value={currentValue || ''}
                    onChange={(e) => onAnswer(question.variableName, e.target.value)}
                    className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow"
                    placeholder="Type your answer..."
                />
            </div>
        );
    }

    if (question.type === 'number') {
        return (
            <div className="space-y-4">
                <label className="block text-xl font-semibold mb-2">{question.label}</label>
                <input
                    type="number"
                    value={currentValue !== undefined ? currentValue : ''}
                    onChange={(e) => onAnswer(question.variableName, e.target.value === '' ? undefined : Number(e.target.value))}
                    className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow"
                    placeholder="Enter a number..."
                />
            </div>
        );
    }

    return <div>Unsupported question type: {question.type}</div>;
}
