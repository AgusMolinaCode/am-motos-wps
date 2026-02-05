import type { StatData } from './types';
import { StatCard } from './StatCard';

interface StatsGridProps {
  stats: StatData[];
}

export function StatsGrid({ stats }: StatsGridProps) {
  // Encontrar el stat featured (Total Comprado)
  const featuredStat = stats.find(s => s.featured);
  const regularStats = stats.filter(s => !s.featured);

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 mb-8">
      {/* Featured stat - Total Comprado (ocupa más espacio en desktop) */}
      {featuredStat && (
        <div className="md:col-span-1">
          <StatCard stat={featuredStat} featured />
        </div>
      )}
      
      {/* Stats regulares */}
      {regularStats.map((stat) => (
        <StatCard key={stat.title} stat={stat} />
      ))}
    </div>
  );
}
