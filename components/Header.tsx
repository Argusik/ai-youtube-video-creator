
import React from 'react';
import { VideoCameraIcon } from './icons';

export const Header: React.FC = () => {
  return (
    <header className="bg-slate-900/70 backdrop-blur-sm border-b border-slate-700/50 sticky top-0 z-10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <VideoCameraIcon className="h-8 w-8 text-purple-400" />
            <span className="text-xl font-bold tracking-tight text-slate-100">
              AI YouTube Video Creator
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
