
import React, { useState, useCallback } from 'react';
import type { Short } from '../types';
import { generateImage } from '../services/geminiService';
import { ImageIcon, MagicWandIcon } from './icons';

interface ShortCardProps {
  short: Short;
  shortNumber: number;
}

export const ShortCard: React.FC<ShortCardProps> = ({ short, shortNumber }) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateImage = useCallback(async () => {
    setIsGenerating(true);
    setError(null);
    try {
      const generatedUrl = await generateImage(short.visual_prompt, '9:16');
      setImageUrl(generatedUrl);
    } catch (e) {
      console.error(e);
      setError('Image generation failed.');
    } finally {
      setIsGenerating(false);
    }
  }, [short.visual_prompt]);

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:border-slate-600">
      <div className="p-5 flex gap-5">
        <div className="w-2/3">
            <h3 className="text-lg font-semibold text-purple-300">
            Short #{shortNumber}: <span className="text-slate-100">{short.title}</span>
            </h3>
            <p className="mt-2 text-slate-300 text-sm leading-relaxed">{short.narration}</p>
        </div>
        <div className="w-1/3">
            <div className="aspect-[9/16] bg-slate-900 rounded-lg flex items-center justify-center border border-slate-700">
            {isGenerating ? (
                <div className="text-center text-slate-400 p-2">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-400 mx-auto"></div>
                <p className="mt-2 text-xs">Generating...</p>
                </div>
            ) : imageUrl ? (
                <img src={imageUrl} alt={short.title} className="w-full h-full object-cover rounded-lg" />
            ) : (
                <div className="text-center text-slate-500 p-2">
                <ImageIcon className="h-8 w-8 mx-auto" />
                <p className="mt-1 text-xs">Vertical Image</p>
                </div>
            )}
            </div>
        </div>
      </div>
      <div className="px-5 pb-5">
         {error && <p className="text-red-400 text-xs mt-2 text-center">{error}</p>}
        {!imageUrl && (
            <div className="flex justify-end">
            <button
                type="button"
                onClick={handleGenerateImage}
                disabled={isGenerating}
                className="inline-flex items-center gap-x-1.5 rounded-md bg-slate-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-600 disabled:bg-slate-700 disabled:cursor-not-allowed transition-colors"
            >
                <MagicWandIcon className="-ml-0.5 h-5 w-5" aria-hidden="true" />
                Generate Vertical Image
            </button>
            </div>
        )}
      </div>
    </div>
  );
};
