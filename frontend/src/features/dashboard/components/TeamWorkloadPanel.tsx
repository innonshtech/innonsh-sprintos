import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Users } from 'lucide-react';
import WorkloadBar from './WorkloadBar';

interface TeamWorkloadProps {
  workload: any[];
  isLoading: boolean;
}

export default function TeamWorkloadPanel({ workload, isLoading }: TeamWorkloadProps) {
  if (isLoading || !workload) {
    return (
      <Card className="h-full bg-card shadow-soft border-muted animate-pulse">
        <CardHeader><CardTitle className="bg-muted h-6 w-1/3 rounded"></CardTitle></CardHeader>
        <CardContent><div className="space-y-6"><div className="h-10 bg-muted rounded w-full"></div><div className="h-10 bg-muted rounded w-full"></div></div></CardContent>
      </Card>
    );
  }

  // Pre-defined mapping matching requirements
  const getMemberColor = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes('lokeek')) return 'bg-blue-500';
    if (n.includes('chetana')) return 'bg-orange-500';
    if (n.includes('vaibhav')) return 'bg-emerald-500';
    if (n.includes('aniket')) return 'bg-cyan-500';
    
    // Fallback dynamic colors
    const colors = ['bg-indigo-500', 'bg-violet-500', 'bg-fuchsia-500', 'bg-rose-500'];
    return colors[name.length % colors.length];
  };

  return (
    <Card className="h-full bg-card shadow-soft border-muted flex flex-col">
      <CardHeader className="pb-4 border-b">
        <CardTitle className="text-xl flex items-center gap-2">
          <Users className="w-5 h-5 text-indigo-500" /> Team Workload Distribution
        </CardTitle>
        <CardDescription>Current sprint task allocation</CardDescription>
      </CardHeader>
      
      <CardContent className="flex-1 pt-4 overflow-y-auto custom-scrollbar max-h-[500px]">
        <div className="space-y-4">
          {workload.map((member: any, i: number) => (
            <WorkloadBar 
              key={i} 
              member={member} 
              colorClass={getMemberColor(member.member)} 
            />
          ))}
          {workload.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No team workload data available.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
