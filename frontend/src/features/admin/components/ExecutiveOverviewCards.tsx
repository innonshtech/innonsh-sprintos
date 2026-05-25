import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAdminOverview } from '../hooks/useAdmin';
import { motion } from 'framer-motion';

export const ExecutiveOverviewCards = () => {
  const { data: overview, isLoading } = useAdminOverview();

  if (isLoading || !overview) return <div className="animate-pulse flex gap-4 h-32 w-full bg-slate-800/50 rounded-xl" />;

  const stats = [
    { title: 'Total Projects', value: overview.totalProjects, color: 'text-blue-400' },
    { title: 'Active Sprints', value: overview.activeSprints, color: 'text-emerald-400' },
    { title: 'Total Tasks', value: overview.totalTasks, color: 'text-indigo-400' },
    { title: 'Completed Tasks', value: overview.completedTasks, color: 'text-green-400' },
    { title: 'Delayed Tasks', value: overview.delayedTasks, color: 'text-orange-400' },
    { title: 'Active Blockers', value: overview.activeBlockers, color: 'text-red-400' },
    { title: 'Team Productivity', value: `${overview.productivityScore}%`, color: 'text-purple-400' },
    { title: 'Sprint Success Rate', value: `${overview.sprintSuccessRate}%`, color: 'text-teal-400' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
        >
          <Card className="bg-slate-900/60 border-slate-800 backdrop-blur-xl hover:bg-slate-800/60 transition-colors">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                {stat.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-3xl font-bold ${stat.color}`}>{stat.value}</div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};
