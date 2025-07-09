
import React from 'react';
import type { Scene } from '../types';
import { SceneCard } from './SceneCard';
import { DevicePhoneMobileIcon, SparklesIcon } from './icons';

interface ScriptDisplayProps {
  script: Scene[];
  onGenerateShorts: () => void;
  isLoadingShorts: boolean;
}

export const ScriptDisplay: React.FC<ScriptDisplayProps> = ({ script, onGenerateShorts, isLoadingShorts }) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-2xl font-bold text-slate-100 tracking-tight">Generated Script</h2>
        <button
          type="button"
          onClick={onGenerateShorts}
          disabled={isLoadingShorts}
          className="inline-flex items-center justify-center gap-x-2 rounded-md bg-purple-600 px-3.5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-purple-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors"
        >
          {isLoadingShorts ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Creating Shorts...
            </>
          ) : (
            <>
              <SparklesIcon className="-ml-0.5 h-5 w-5" aria-hidden="true" />
              Create Shorts from Script
            </>
          )}
        </button>
      </div>

      {script.map((scene, index) => (
        <SceneCard key={index} scene={scene} sceneNumber={index + 1} />
      ))}
    </div>
  );
};
