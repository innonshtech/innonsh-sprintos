import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface MiniKanbanColumnProps {
  title: string;
  data: {
    count: number;
    storyPoints: number;
    members: string[];
  };
  colorClass: string;
}

export default function MiniKanbanColumn({ title, data, colorClass }: MiniKanbanColumnProps) {
  return (
    <div className={`flex flex-col bg-card/50 border rounded-lg p-3 hover:shadow-sm transition-shadow ${colorClass}`}>
      <div className="flex justify-between items-center mb-3">
        <span className="text-xs font-bold uppercase tracking-wider">{title}</span>
        <span className="bg-background px-2 py-0.5 rounded text-xs font-bold shadow-sm">
          {data.count}
        </span>
      </div>
      
      <div className="mt-auto pt-2 border-t border-border/50 flex justify-between items-end">
        <div className="flex -space-x-2">
          {data.members.slice(0, 3).map((m, i) => (
            <Avatar key={i} className="w-6 h-6 border-2 border-background">
              <AvatarImage src={m.length > 1 ? m : undefined} />
              <AvatarFallback className="text-[10px] bg-muted">{m.charAt(0)}</AvatarFallback>
            </Avatar>
          ))}
          {data.members.length > 3 && (
            <div className="w-6 h-6 rounded-full bg-muted border-2 border-background flex items-center justify-center text-[10px] font-medium z-10">
              +{data.members.length - 3}
            </div>
          )}
        </div>
        
        <div className="text-right">
          <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Points</span>
          <p className="text-xs font-bold">{data.storyPoints}</p>
        </div>
      </div>
    </div>
  );
}
