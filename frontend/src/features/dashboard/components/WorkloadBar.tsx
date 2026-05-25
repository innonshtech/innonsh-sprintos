import { Progress } from '@/components/ui/progress';

interface WorkloadBarProps {
  member: any;
  colorClass: string;
}

export default function WorkloadBar({ member, colorClass }: WorkloadBarProps) {
  const statusColors: Record<string, string> = {
    'Healthy': 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
    'Overloaded': 'text-amber-500 bg-amber-500/10 border-amber-500/20',
    'Critical': 'text-red-500 bg-red-500/10 border-red-500/20',
    'Low': 'text-indigo-500 bg-indigo-500/10 border-indigo-500/20',
  };

  const statusStyle = statusColors[member.status] || statusColors['Healthy'];

  return (
    <div className="space-y-2 p-3 hover:bg-muted/30 rounded-lg transition-colors border border-transparent hover:border-border/50">
      <div className="flex justify-between items-center mb-1">
        <div className="flex items-center gap-2">
          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-sm ${colorClass}`}>
            {member.member.charAt(0)}
          </div>
          <span className="font-semibold text-sm">{member.member}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-[10px] px-2 py-0.5 rounded uppercase font-bold border ${statusStyle}`}>
            {member.status}
          </span>
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <Progress 
            value={member.utilization} 
            className="h-2.5 bg-muted" 
            indicatorClassName={colorClass} 
          />
        </div>
        <span className="text-sm font-bold w-16 text-right">{member.assignedTasks} Tasks</span>
      </div>

      <div className="flex justify-between text-xs text-muted-foreground mt-1 px-1">
        <span>{member.completedTasks} Completed</span>
        <span>{member.pendingTasks} Pending</span>
        {member.blockers > 0 && <span className="text-red-500 font-medium">{member.blockers} Blockers</span>}
      </div>
    </div>
  );
}
