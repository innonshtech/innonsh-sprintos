import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAdminProjects } from '../hooks/useAdmin';
import { motion } from 'framer-motion';

export const OrganizationOverviewPanel = () => {
  const { data: projects, isLoading } = useAdminProjects();

  if (isLoading) return <div className="h-64 animate-pulse bg-slate-800/50 rounded-xl" />;

  const getHealthColor = (health: string) => {
    switch (health) {
      case 'Healthy': return 'bg-emerald-500/10 text-emerald-500';
      case 'Warning': return 'bg-orange-500/10 text-orange-500';
      case 'Critical': return 'bg-red-500/10 text-red-500';
      default: return 'bg-slate-500/10 text-slate-500';
    }
  };

  return (
    <Card className="bg-slate-900/60 border-slate-800 backdrop-blur-xl">
      <CardHeader>
        <CardTitle className="text-xl text-slate-200">Organization Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {projects?.map((project: any, i: number) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center justify-between p-4 rounded-lg bg-slate-800/40 border border-slate-800/50 hover:bg-slate-800/60 transition-colors"
            >
              <div className="flex-1">
                <h4 className="font-semibold text-slate-200">{project.name}</h4>
                <div className="text-sm text-slate-400 mt-1 flex gap-4">
                  <span>PM: {project.owner || 'Unassigned'}</span>
                  <span>Active Sprint: {project.activeSprint}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <div className="text-sm font-medium text-slate-300">{project.completionPercent}% Complete</div>
                  <div className="text-xs text-slate-500">{project.completedTasks} / {project.totalTasks} Tasks</div>
                </div>
                
                <Badge className={getHealthColor(project.health)} variant="outline">
                  {project.health} ({project.healthScore}%)
                </Badge>
              </div>
            </motion.div>
          ))}
          {projects?.length === 0 && (
            <div className="text-center text-slate-500 py-8">No active projects found.</div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
