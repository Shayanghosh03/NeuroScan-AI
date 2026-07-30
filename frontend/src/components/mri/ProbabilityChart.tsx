import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import type { ClassProbabilities } from '../../types';

interface ProbabilityChartProps {
  probabilities: ClassProbabilities;
}

export const ProbabilityChart: React.FC<ProbabilityChartProps> = ({ probabilities }) => {
  const data = [
    { name: 'Glioma', value: probabilities.Glioma || 0, color: '#ef4444' },
    { name: 'Meningioma', value: probabilities.Meningioma || 0, color: '#f59e0b' },
    { name: 'Pituitary', value: probabilities.Pituitary || 0, color: '#8b5cf6' },
    { name: 'No Tumor', value: probabilities['No Tumor'] || 0, color: '#10b981' },
  ];

  return (
    <div className="w-full h-56">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <XAxis
            dataKey="name"
            tick={{ fill: '#94a3b8', fontSize: 12 }}
            axisLine={{ stroke: '#334155' }}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: '#94a3b8', fontSize: 12 }}
            axisLine={{ stroke: '#334155' }}
            tickLine={false}
            domain={[0, 100]}
            unit="%"
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#0f172a',
              borderColor: '#334155',
              borderRadius: '12px',
              color: '#ffffff',
              fontSize: '12px',
            }}
            formatter={(value: any) => [`${value}%`, 'Probability']}
          />
          <Bar dataKey="value" radius={[8, 8, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
