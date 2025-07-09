
import React from 'react';
import type { Short } from '../types';
import { ShortCard } from './ShortCard';
import { DevicePhoneMobileIcon } from './icons';

interface ShortsDisplayProps {
  shorts: Short[];
}

export const ShortsDisplay: React.FC<ShortsDisplayProps> = ({ shorts }) => {
  return (
    <div className="space-y-6">
       <h2 className="text-2xl font-bold text-slate-100 tracking-tight flex items-center gap-2">
        <DevicePhoneMobileIcon className="h-7 w-7 text-purple-300" />
        Shorts Ideas
      </h2>
      {shorts.map((short, index) => (
        <ShortCard key={index} short={short} shortNumber={index + 1} />
      ))}
    </div>
  );
};
