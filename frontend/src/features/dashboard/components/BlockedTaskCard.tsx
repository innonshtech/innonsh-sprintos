import { AlertCircle, Clock } from 'lucide-react';

interface BlockedTaskCardProps {
  task: {
    id: string;
    title: string;
    assignee: string;
    blockerReason: string;
    severity: string;
    timeBlocked: string;
  };
}

export default function BlockedTaskCard({ task }: BlockedTaskCardProps) {
  return (
    <div className="border-l-4 border-l-red-500 bg-red-500/5 dark:bg-red-500/10 p-3 rounded-r-md border border-y-red-500/10 border-r-red-500/10 transition-colors hover:bg-red-500/10">
      <div className="flex justify-between items-start mb-1">
        <h4 className="font-semibold text-sm line-clamp-1">{task.title}</h4>
        <span className="text-[10px] uppercase font-bold bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-400 px-1.5 py-0.5 rounded-sm shrink-0 ml-2">
          {task.severity}
        </span>
      </div>
      
      <div className="flex items-center text-xs text-muted-foreground mb-2">
        <span className="font-medium mr-2">{task.assignee}</span>
        <Clock className="w-3 h-3 mr-1" />
        <span>Blocked {task.timeBlocked}</span>
      </div>

      <div className="flex items-start gap-1.5 text-xs text-red-600 dark:text-red-400 bg-red-100/50 dark:bg-red-900/20 p-2 rounded">
        <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
        <span className="line-clamp-2">{task.blockerReason}</span>
      </div>
    </div>
  );
}
