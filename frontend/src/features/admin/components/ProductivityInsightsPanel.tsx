import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useIntelligence } from '../hooks/useAdmin';
import { motion } from 'framer-motion';
import { AlertCircle, Info, Zap } from 'lucide-react';

export const ProductivityInsightsPanel = () => {
  const { data: insights, isLoading } = useIntelligence();

  if (isLoading) return <div className="h-64 animate-pulse bg-slate-800/50 rounded-xl" />;

  const getIcon = (type: string) => {
    switch (type) {
      case 'CRITICAL': return <AlertCircle className="h-5 w-5 text-red-400" />;
      case 'WARNING': return <AlertCircle className="h-5 w-5 text-orange-400" />;
      case 'INFO': return <Info className="h-5 w-5 text-blue-400" />;
      default: return <Zap className="h-5 w-5 text-purple-400" />;
    }
  };

  const getBgColor = (type: string) => {
    switch (type) {
      case 'CRITICAL': return 'bg-red-500/10 border-red-500/20';
      case 'WARNING': return 'bg-orange-500/10 border-orange-500/20';
      case 'INFO': return 'bg-blue-500/10 border-blue-500/20';
      default: return 'bg-purple-500/10 border-purple-500/20';
    }
  };

  return (
    <Card className="bg-slate-900/60 border-slate-800 backdrop-blur-xl h-full">
      <CardHeader>
        <CardTitle className="text-xl text-slate-200 flex items-center gap-2">
          <Zap className="h-5 w-5 text-yellow-400" />
          AI Intelligence Insights
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {insights?.map((insight: any, i: number) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`flex gap-3 p-3 rounded-lg border ${getBgColor(insight.type)}`}
            >
              <div className="mt-0.5 shrink-0">{getIcon(insight.type)}</div>
              <div>
                <p className="text-sm text-slate-200">{insight.message}</p>
                <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider">{insight.source}</p>
              </div>
            </motion.div>
          ))}
          {insights?.length === 0 && (
            <div className="text-center text-slate-500 py-8">
              No significant insights at the moment. System is running smoothly.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
