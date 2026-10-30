import React from 'react';

interface SparklineProps {
  data: number[];
  width?: number;
  height?: number;
  color?: string;
  className?: string;
}

export const Sparkline: React.FC<SparklineProps> = ({
  data,
  width = 120,
  height = 36,
  color = '#DC2626',
  className = '',
}) => {
  if (!data || data.length < 2) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const padding = 4;
  const effectiveWidth = width - padding * 2;
  const effectiveHeight = height - padding * 2;

  const points = data
    .map((val, idx) => {
      const x = padding + (idx / (data.length - 1)) * effectiveWidth;
      const y = height - padding - ((val - min) / range) * effectiveHeight;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');

  const lastPoint = points.split(' ').pop()?.split(',');
  const lastX = lastPoint ? lastPoint[0] : '0';
  const lastY = lastPoint ? lastPoint[1] : '0';

  return (
    <div className={`inline-block ${className}`} title={`14-day trend: ${data[0]} -> ${data[data.length - 1]}`}>
      <svg width={width} height={height} className="overflow-visible">
        <polyline
          fill="none"
          stroke={color}
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={points}
        />
        {/* Highlight latest point */}
        <circle
          cx={lastX}
          cy={lastY}
          r="3.5"
          fill={color}
          className="animate-pulse"
        />
      </svg>
    </div>
  );
};
