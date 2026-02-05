import { Card, CardContent } from '@/components/ui/card';
import type { StatData } from './types';

interface StatCardProps {
  stat: StatData;
  featured?: boolean;
}

export function StatCard({ stat, featured = false }: StatCardProps) {
  const Icon = stat.icon;
  
  return (
    <Card className={`group bg-card/50 border-border/50 backdrop-blur-sm overflow-hidden hover:border-border transition-all duration-300 h-full ${
      featured ? 'ring-2 ring-emerald-500/20' : ''
    }`}>
      <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${stat.color}`} />
      <CardContent className={`p-6 flex flex-col justify-between h-full ${featured ? 'min-h-[140px]' : ''}`}>
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <p className={`text-muted-foreground font-medium mb-1 ${featured ? 'text-sm' : 'text-xs'}`}>
              {stat.title}
            </p>
            <p className={`font-black text-foreground truncate ${featured ? 'text-3xl sm:text-4xl' : 'text-2xl sm:text-3xl'}`}>
              {stat.value}
            </p>
            <p className={`mt-1 ${featured ? 'text-sm' : 'text-xs'} ${
              stat.trend === 'up' ? 'text-emerald-600 dark:text-emerald-400' : 'text-muted-foreground'
            }`}>
              {stat.change}
            </p>
          </div>
          <div className={`flex-shrink-0 ml-4 rounded-xl bg-gradient-to-br ${stat.color} shadow-lg ${
            featured ? 'p-4' : 'p-3'
          }`}>
            <Icon className={`text-white ${featured ? 'w-6 h-6' : 'w-5 h-5'}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
