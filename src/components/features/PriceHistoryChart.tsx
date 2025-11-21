import React from 'react';
import { PriceDataPoint } from '../../types';

interface PriceHistoryChartProps {
  data: PriceDataPoint[];
}

const PriceHistoryChart: React.FC<PriceHistoryChartProps> = ({ data }) => {
  if (!data || data.length < 2) {
    return <p className="text-sm text-[var(--text-secondary)]">Not enough price data to display a chart.</p>;
  }

  const width = 300;
  const height = 150;
  const padding = 20;

  const prices = data.map(d => d.price);
  const dates = data.map(d => new Date(d.date));

  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const minDate = Math.min(...dates.map(d => d.getTime()));
  const maxDate = Math.max(...dates.map(d => d.getTime()));

  const getX = (date: Date) => {
    return padding + ((date.getTime() - minDate) / (maxDate - minDate)) * (width - 2 * padding);
  };

  const getY = (price: number) => {
    return height - padding - ((price - minPrice) / (maxPrice - minPrice)) * (height - 2 * padding);
  };

  const path = data.map((d, i) => {
      const x = getX(new Date(d.date));
      const y = getY(d.price);
      return `${i === 0 ? 'M' : 'L'} ${x},${y}`;
    }).join(' ');

  const areaPath = `${path} V ${height - padding} L ${padding},${height - padding} Z`;

  return (
    <div className="w-full">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
        {/* Grid lines */}
        {[...Array(5)].map((_, i) => (
          <line
            key={i}
            x1={padding}
            y1={padding + i * (height - 2 * padding) / 4}
            x2={width - padding}
            y2={padding + i * (height - 2 * padding) / 4}
            stroke="var(--border-color)"
            strokeWidth="0.5"
            strokeDasharray="2,2"
          />
        ))}

        {/* Gradient for area */}
        <defs>
          <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--primary-accent)" stopOpacity="0.3" />
            <stop offset="100%" stopColor="var(--primary-accent)" stopOpacity="0" />
          </linearGradient>
        </defs>
        
        {/* Area under the line */}
        <path d={areaPath} fill="url(#priceGradient)" />

        {/* Price line */}
        <path d={path} fill="none" stroke="var(--primary-accent)" strokeWidth="2" />

        {/* Data points */}
        {data.map((d, i) => (
          <circle key={i} cx={getX(new Date(d.date))} cy={getY(d.price)} r="3" fill="var(--primary-accent)" />
        ))}

        {/* Axis Labels */}
        <text x={padding} y={height - 5} fontSize="8" fill="var(--text-secondary)">
          {dates[0].toLocaleDateString(undefined, { month: 'short', year: '2-digit' })}
        </text>
        <text x={width - padding} y={height - 5} fontSize="8" fill="var(--text-secondary)" textAnchor="end">
          {dates[dates.length - 1].toLocaleDateString(undefined, { month: 'short', year: '2-digit' })}
        </text>
        <text x={padding} y={10} fontSize="8" fill="var(--text-secondary)">${maxPrice.toFixed(0)}</text>
        <text x={padding} y={height - padding + 5} fontSize="8" fill="var(--text-secondary)">${minPrice.toFixed(0)}</text>
      </svg>
    </div>
  );
};

export default PriceHistoryChart;
