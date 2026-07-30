import React from 'react';
import { motion } from 'framer-motion';

interface ConfidenceMeterProps {
  confidence: number;
  prediction: string;
}

export const ConfidenceMeter: React.FC<ConfidenceMeterProps> = ({ confidence, prediction }) => {
  const isHealthy = prediction === 'No Tumor';
  const colorScheme = isHealthy
    ? {
        stroke: '#10b981',
        bg: 'text-emerald-500',
        gradient: 'from-emerald-500 to-teal-400',
      }
    : {
        stroke: '#f43f5e',
        bg: 'text-rose-500',
        gradient: 'from-rose-500 to-amber-500',
      };

  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (confidence / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="relative w-36 h-36 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="72"
            cy="72"
            r={radius}
            className="stroke-slate-200 dark:stroke-slate-800"
            strokeWidth="10"
            fill="transparent"
          />
          <motion.circle
            cx="72"
            cy="72"
            r={radius}
            stroke={colorScheme.stroke}
            strokeWidth="10"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
            strokeLinecap="round"
            fill="transparent"
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {confidence}%
          </span>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            Confidence
          </span>
        </div>
      </div>
    </div>
  );
};
