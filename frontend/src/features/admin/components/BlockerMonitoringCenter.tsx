import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAdminBlockers } from '../hooks/useAdmin';
import { motion } from 'framer-motion';
import { AlertTriangle, Clock } from 'lucide-react';

export const BlockerMonitoringCenter = () => {
  const { data: blockers, isLoading } = useAdminBlockers();

  if (isLoading) return <div className="h-64 animate-pulse bg-slate-800/50 rounded-xl" />;

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'CRITICAL': return 'bg-red-500 text-white';
      case 'HIGH': return 'bg-orange-500 text-white';
      case 'MEDIUM': return 'bg-yellow-500 text-slate-900';
      case 'LOW': return 'bg-blue-500 text-white';
      default: return 'bg-slate-500 text-white';
    }
  };

  return (
    <Card className="bg-slate-900/60 border-slate-800 backdrop-blur-xl h-full">
      <CardHeader>
        <CardTitle className="text-xl text-slate-200 flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-red-400" />
          Blockers & Risk Center
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
          {blockers?.map((blocker: any, i: number) => (
            <motion.div
              key={blocker.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-4 rounded-lg bg-slate-800/40 border border-slate-800/50 hover:bg-slate-800/60 transition-colors"
            >
              <div className="flex justify-between items-start mb-2">
                <Badge className={getSeverityColor(blocker.severity)}>
                  {blocker.severity}
                </Badge>
                <div className="flex items-center text-xs text-slate-400 gap-1">
                  <Clock className="h-3 w-3" />
                  {new Date(blocker.createdAt).toLocaleDateString()}
                </div>
              </div>
              
              <p className="text-sm text-slate-300 font-medium mb-2">{blocker.description}</p>
              
              <div className="flex justify-between items-end mt-4 text-xs">
                <div className="text-slate-400">
                  <span className="block mb-1">Task: {blocker.task?.title || 'Unknown'}</span>
                  <span className="block">Project: {blocker.task?.project?.name || 'Unknown'}</span>
                </div>
                <div className="text-right">
                  <span className="text-slate-500">Reported by</span>
                  <div className="text-slate-300 font-medium mt-0.5">{blocker.reporter?.name}</div>
                </div>
              </div>
            </motion.div>
          ))}
          {blockers?.length === 0 && (
            <div className="text-center text-emerald-400 py-8 flex flex-col items-center">
              <div className="h-12 w-12 rounded-full bg-emerald-500/10 flex items-center justify-center mb-3">
                <AlertTriangle className="h-6 w-6 text-emerald-500" />
              </div>
              No active blockers! System is healthy.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
