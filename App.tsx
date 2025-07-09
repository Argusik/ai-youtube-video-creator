
import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { TopicInput } from './components/TopicInput';
import { ScriptDisplay } from './components/ScriptDisplay';
import { TitleSuggestions } from './components/TitleSuggestions';
import { ShortsDisplay } from './components/ShortsDisplay';
import { generateScriptAndTitles, generateShortsFromScript } from './services/geminiService';
import type { Scene, Short } from './types';
import { SparklesIcon } from './components/icons';

const App: React.FC = () => {
  const [topic, setTopic] = useState<string>('');
  const [script, setScript] = useState<Scene[] | null>(null);
  const [titles, setTitles] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [shorts, setShorts] = useState<Short[] | null>(null);
  const [isLoadingShorts, setIsLoadingShorts] = useState<boolean>(false);
  const [errorShorts, setErrorShorts] = useState<string | null>(null);

  const handleGenerate = useCallback(async () => {
    if (!topic.trim()) {
      setError('Please enter a video topic.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setScript(null);
    setTitles([]);
    setShorts(null);
    setErrorShorts(null);

    try {
      const result = await generateScriptAndTitles(topic);
      if (result) {
        setScript(result.script);
        setTitles(result.titles);
      } else {
        setError('Failed to generate content. The response was empty.');
      }
    } catch (e) {
      console.error(e);
      setError('An error occurred while communicating with the AI. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [topic]);

  const handleGenerateShorts = useCallback(async () => {
    if (!script) return;

    setIsLoadingShorts(true);
    setErrorShorts(null);
    setShorts(null);

    try {
        const result = await generateShortsFromScript(script);
        if (result && result.shorts.length > 0) {
            setShorts(result.shorts);
        } else {
            setErrorShorts('The AI could not generate any Shorts from this script.');
        }
    } catch(e) {
        console.error(e);
        setErrorShorts('An error occurred while generating Shorts. Please try again.');
    } finally {
        setIsLoadingShorts(false);
    }
  }, [script]);
  
  const WelcomeScreen: React.FC = () => (
    <div className="text-center mt-16 animate-fade-in">
        <div className="inline-block p-4 bg-slate-800/50 rounded-full">
            <SparklesIcon className="w-16 h-16 text-purple-400" />
        </div>
        <h2 className="mt-6 text-3xl font-bold tracking-tight text-slate-100 sm:text-4xl">
            AI YouTube Video Studio
        </h2>
        <p className="mt-4 text-lg text-slate-400">
            Enter a topic above and let AI craft your next viral video script.
        </p>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-900">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <TopicInput
            topic={topic}
            setTopic={setTopic}
            onGenerate={handleGenerate}
            isLoading={isLoading}
          />

          {error && (
            <div className="mt-4 p-4 bg-red-900/50 border border-red-700 text-red-300 rounded-lg text-center">
              {error}
            </div>
          )}
          
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
                {isLoading && (
                    <div className="flex justify-center items-center p-8">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400"></div>
                    </div>
                )}
                {!isLoading && script && (
                  <ScriptDisplay 
                    script={script}
                    onGenerateShorts={handleGenerateShorts}
                    isLoadingShorts={isLoadingShorts}
                  />
                )}
                 {!isLoading && shorts && (
                  <ShortsDisplay shorts={shorts} />
                )}
                 {errorShorts && (
                    <div className="p-4 bg-red-900/50 border border-red-700 text-red-300 rounded-lg text-center">
                        {errorShorts}
                    </div>
                 )}

                {!isLoading && !script && !error && <WelcomeScreen />}
            </div>
            <div className="lg:col-span-1">
              {!isLoading && titles.length > 0 && <TitleSuggestions titles={titles} />}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
