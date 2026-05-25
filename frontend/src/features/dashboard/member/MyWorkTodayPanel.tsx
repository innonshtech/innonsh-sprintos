import { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { Layers } from 'lucide-react';
import AssignedTaskCard from './AssignedTaskCard';
import TodayFocusPanel from './TodayFocusPanel';
import BlockerModal from './BlockerModal';
import QuickStandupWidget from './QuickStandupWidget';

export default function MyWorkTodayPanel({ tasks, reviewQueue }: { tasks: any[], reviewQueue: number }) {
  const [selectedBlockerTask, setSelectedBlockerTask] = useState<any>(null);
  const [selectedUpdateTask, setSelectedUpdateTask] = useState<any>(null);

  const pendingTasks = useMemo(() => tasks.filter(t => t.status !== 'DONE'), [tasks]);

  const highPriority = pendingTasks.filter(t => ['CRITICAL', 'URGENT', 'HIGH'].includes(t.priority));
  const mediumPriority = pendingTasks.filter(t => t.priority === 'MEDIUM');
  const lowPriority = pendingTasks.filter(t => t.priority === 'LOW');

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-[500px]">
        {/* Left Side - Current Assigned Tasks */}
        <div className="lg:col-span-2 flex flex-col">
          <div className="flex items-center gap-2 mb-4">
            <Layers className="h-5 w-5 text-indigo-500" />
            <h2 className="text-xl font-bold tracking-tight">My Work Today</h2>
          </div>
          
          <Card className="flex-1 bg-card/50 shadow-soft border-muted overflow-hidden flex flex-col">
            <CardHeader className="py-3 px-4 border-b bg-muted/20">
              <CardTitle className="text-sm font-medium flex justify-between">
                <span>Assigned Tasks</span>
                <span className="text-muted-foreground">{pendingTasks.length} Pending</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 flex-1">
              <div className="h-[450px] px-4 py-4 overflow-y-auto">
                {pendingTasks.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
                    No pending tasks! 🎉
                  </div>
                ) : (
                  <>
                    {highPriority.length > 0 && (
                      <div className="mb-6">
                        <h3 className="text-xs font-bold text-rose-500 uppercase mb-3 flex items-center gap-2">
                          High Priority <span className="h-px bg-rose-200 flex-1 ml-2"></span>
                        </h3>
                        {highPriority.map(t => (
                          <AssignedTaskCard 
                            key={t.id} 
                            task={t} 
                            onMarkBlocked={setSelectedBlockerTask} 
                            onAddUpdate={setSelectedUpdateTask} 
                          />
                        ))}
                      </div>
                    )}

                    {mediumPriority.length > 0 && (
                      <div className="mb-6">
                        <h3 className="text-xs font-bold text-amber-500 uppercase mb-3 flex items-center gap-2">
                          Medium Priority <span className="h-px bg-amber-200 flex-1 ml-2"></span>
                        </h3>
                        {mediumPriority.map(t => (
                          <AssignedTaskCard 
                            key={t.id} 
                            task={t} 
                            onMarkBlocked={setSelectedBlockerTask} 
                            onAddUpdate={setSelectedUpdateTask} 
                          />
                        ))}
                      </div>
                    )}

                    {lowPriority.length > 0 && (
                      <div className="mb-6">
                        <h3 className="text-xs font-bold text-slate-500 uppercase mb-3 flex items-center gap-2">
                          Low Priority <span className="h-px bg-slate-200 flex-1 ml-2"></span>
                        </h3>
                        {lowPriority.map(t => (
                          <AssignedTaskCard 
                            key={t.id} 
                            task={t} 
                            onMarkBlocked={setSelectedBlockerTask} 
                            onAddUpdate={setSelectedUpdateTask} 
                          />
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Side - Today's Focus Panel */}
        <div className="lg:col-span-1 pt-9">
          <TodayFocusPanel tasks={pendingTasks} reviewQueue={reviewQueue} />
        </div>
      </div>

      <BlockerModal 
        isOpen={!!selectedBlockerTask} 
        onClose={() => setSelectedBlockerTask(null)} 
        task={selectedBlockerTask} 
      />

      <QuickStandupWidget 
        isOpen={!!selectedUpdateTask} 
        onClose={() => setSelectedUpdateTask(null)} 
        task={selectedUpdateTask} 
      />
    </>
  );
}
