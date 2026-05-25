import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useAdminSprints } from '../hooks/useAdmin';
import { motion } from 'framer-motion';

export const SprintMonitoringBoard = () => {
  const { data: sprints, isLoading } = useAdminSprints();

  if (isLoading) return <div className="h-64 animate-pulse bg-slate-800/50 rounded-xl" />;

  return (
    <Card className="bg-slate-900/60 border-slate-800 backdrop-blur-xl">
      <CardHeader>
        <CardTitle className="text-xl text-slate-200">Sprint Intelligence</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {sprints?.map((sprint: any, i: number) => (
            <motion.div
              key={sprint.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className="p-5 rounded-lg bg-slate-800/40 border border-slate-800/50"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="font-semibold text-slate-200">{sprint.name}</h4>
                  <div className="text-sm text-slate-400">{sprint.projectName}</div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-indigo-400">{sprint.completionPercent}%</div>
                  <div className="text-xs text-slate-500">Completed</div>
                </div>
              </div>
              
              <Progress value={sprint.completionPercent} className="h-2 mb-4 bg-slate-700" />
              
              <div className="grid grid-cols-3 gap-2 text-center text-sm">
                <div className="bg-slate-800/60 rounded p-2 text-slate-300">
                  <div className="font-bold text-slate-200">{sprint.totalTasks}</div>
                  <div className="text-xs text-slate-500">Tasks</div>
                </div>
                <div className="bg-slate-800/60 rounded p-2 text-slate-300">
                  <div className="font-bold text-green-400">{sprint.completedTasks}</div>
                  <div className="text-xs text-slate-500">Done</div>
                </div>
                <div className="bg-slate-800/60 rounded p-2 text-slate-300">
                  <div className="font-bold text-blue-400">{sprint.standupsCount}</div>
                  <div className="text-xs text-slate-500">Standups</div>
                </div>
              </div>
            </motion.div>
          ))}
          {sprints?.length === 0 && (
            <div className="col-span-2 text-center text-slate-500 py-8">No active sprints found.</div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
