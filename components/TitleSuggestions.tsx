
import React from 'react';
import { LightBulbIcon } from './icons';

interface TitleSuggestionsProps {
  titles: string[];
}

export const TitleSuggestions: React.FC<TitleSuggestionsProps> = ({ titles }) => {
  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-xl shadow-md p-5 sticky top-24">
      <h3 className="text-lg font-semibold text-slate-100 flex items-center">
        <LightBulbIcon className="h-6 w-6 text-yellow-300 mr-2" />
        Title Suggestions
      </h3>
      <ul className="mt-4 space-y-3">
        {titles.map((title, index) => (
          <li key={index} className="bg-slate-900/70 p-3 rounded-md border border-slate-700">
            <p className="text-sm text-slate-300">{title}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};
