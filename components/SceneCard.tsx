
import React, { useState, useCallback } from 'react';
import type { Scene } from '../types';
import { generateImage } from '../services/geminiService';
import { ImageIcon, MagicWandIcon } from './icons';

interface SceneCardProps {
  scene: Scene;
  sceneNumber: number;
}

export const SceneCard: React.FC<SceneCardProps> = ({ scene, sceneNumber }) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateImage = useCallback(async () => {
    setIsGenerating(true);
    setError(null);
    try {
      const generatedUrl = await generateImage(scene.visual_prompt, '16:9');
      setImageUrl(generatedUrl);
    } catch (e) {
      console.error(e);
      setError('Image generation failed.');
    } finally {
      setIsGenerating(false);
    }
  }, [scene.visual_prompt]);

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:border-slate-600">
      <div className="p-5">
        <h3 className="text-lg font-semibold text-purple-300">
          Scene {sceneNumber}: <span className="text-slate-100">{scene.scene}</span>
        </h3>
        <p className="mt-2 text-slate-300 text-sm leading-relaxed">{scene.narration}</p>
      </div>
      <div className="px-5 pb-5">
        <div className="aspect-video bg-slate-900 rounded-lg flex items-center justify-center border border-slate-700">
          {isGenerating ? (
            <div className="text-center text-slate-400">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400 mx-auto"></div>
              <p className="mt-2 text-sm">Generating image...</p>
            </div>
          ) : imageUrl ? (
            <img src={imageUrl} alt={scene.scene} className="w-full h-full object-cover rounded-lg" />
          ) : (
            <div className="text-center text-slate-500 p-4">
              <ImageIcon className="h-10 w-10 mx-auto" />
              <p className="mt-2 text-sm">Image will appear here</p>
            </div>
          )}
        </div>
         {error && <p className="text-red-400 text-xs mt-2 text-center">{error}</p>}
        {!imageUrl && (
            <div className="mt-4 flex justify-end">
            <button
                type="button"
                onClick={handleGenerateImage}
                disabled={isGenerating}
                className="inline-flex items-center gap-x-1.5 rounded-md bg-slate-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-600 disabled:bg-slate-700 disabled:cursor-not-allowed transition-colors"
            >
                <MagicWandIcon className="-ml-0.5 h-5 w-5" aria-hidden="true" />
                Generate Image
            </button>
            </div>
        )}
      </div>
    </div>
  );
};
