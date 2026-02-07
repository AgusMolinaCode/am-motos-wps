import type { StatData } from './types';
import { StatCard } from './StatCard';

interface StatsGridProps {
  stats: StatData[];
}

export function StatsGrid({ stats }: StatsGridProps) {
  // Encontrar el stat featured (Total Comprado)
  const featuredStat = stats.find(s => s.featured);
  // Stats compactos (los 3 de estado: activos, en tránsito, entregados)
  const compactStats = stats.filter(s => s.compact);

  return (
    <div className="flex flex-col xl:flex-row gap-4 mb-8">
      {/* Featured stat - Total Comprado (ocupa más espacio) */}
      {featuredStat && (
        <div className="flex-1 min-w-0">
          <StatCard stat={featuredStat} featured />
        </div>
      )}

      {/* Stats compactos (juntos y más pequeños) */}
      <div className="flex gap-3 xl:w-auto">
        {compactStats.map((stat) => (
          <div key={stat.title} className="flex-1 xl:flex-none xl:w-[258px]">
            <StatCard stat={stat} compact />
          </div>
        ))}
      </div>
    </div>
  );
}
