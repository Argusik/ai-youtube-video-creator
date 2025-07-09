
import React from 'react';
import { SparklesIcon } from './icons';

interface TopicInputProps {
  topic: string;
  setTopic: (topic: string) => void;
  onGenerate: () => void;
  isLoading: boolean;
}

export const TopicInput: React.FC<TopicInputProps> = ({ topic, setTopic, onGenerate, isLoading }) => {
  return (
    <div className="bg-slate-800 rounded-xl p-4 shadow-lg border border-slate-700">
      <label htmlFor="topic" className="block text-sm font-medium text-slate-300 mb-2">
        What's your video about?
      </label>
      <textarea
        id="topic"
        name="topic"
        rows={3}
        className="block w-full rounded-md border-0 bg-slate-900/80 py-2.5 px-3 text-slate-100 shadow-sm ring-1 ring-inset ring-slate-700 placeholder:text-slate-500 focus:ring-2 focus:ring-inset focus:ring-purple-500 sm:text-sm sm:leading-6 transition"
        placeholder="e.g., A 10-minute documentary on the history of space exploration"
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        disabled={isLoading}
      />
      <div className="mt-4 flex justify-end">
        <button
          type="button"
          onClick={onGenerate}
          disabled={isLoading || !topic.trim()}
          className="inline-flex items-center gap-x-2 rounded-md bg-purple-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-purple-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Generating...
            </>
          ) : (
            <>
              <SparklesIcon className="h-5 w-5" aria-hidden="true" />
              Generate Script
            </>
          )}
        </button>
      </div>
    </div>
  );
};
