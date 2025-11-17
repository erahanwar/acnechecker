import React from 'react';
import { TrendingUp } from 'lucide-react';
import { LesionCounts } from '../types';
import { getLesionTypeInfo } from '../utils/lesionTypeInfo';

interface LesionCounterProps {
  counts: LesionCounts;
}

export const LesionCounter: React.FC<LesionCounterProps> = ({ counts }) => {
  const lesionTypes = [
    { type: 'comedone' as const, count: counts.comedones },
    { type: 'papule' as const, count: counts.papules },
    { type: 'pustule' as const, count: counts.pustules },
    { type: 'nodule' as const, count: counts.nodules }
  ];

  return (
    <div className="glass-light rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="w-5 h-5 text-white" />
        <h3 className="text-lg font-bold text-white">Live Count</h3>
      </div>

      <div className="space-y-3 mb-4">
        {lesionTypes.map(({ type, count }) => {
          const info = getLesionTypeInfo(type);
          return (
            <div key={type} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: info.color }}
                ></div>
                <span className="text-white/90 text-sm">{info.name}</span>
              </div>
              <span className="text-white font-bold text-lg">{count}</span>
            </div>
          );
        })}
      </div>

      <div className="pt-3 border-t border-white/20">
        <div className="flex items-center justify-between">
          <span className="text-white font-semibold">Total Lesions</span>
          <span className="text-white font-bold text-2xl">{counts.total}</span>
        </div>
        <div className="flex items-center justify-between mt-2">
          <span className="text-white/70 text-sm">Inflammatory</span>
          <span className="text-white/90 font-semibold">{counts.inflammatory}</span>
        </div>
      </div>
    </div>
  );
};
