import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Mic2 } from 'lucide-react';
import StandupUpdateCard from './StandupUpdateCard';

interface StandupMonitoringProps {
  standups: any[];
  isLoading: boolean;
}

export default function TeamStandupMonitoring({ standups, isLoading }: StandupMonitoringProps) {
  if (isLoading || !standups) {
    return (
      <Card className="bg-card shadow-soft border-muted animate-pulse h-[300px]">
        <CardHeader><CardTitle className="bg-muted h-6 w-1/4 rounded"></CardTitle></CardHeader>
      </Card>
    );
  }

  return (
    <Card className="bg-card shadow-soft border-muted">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <div>
          <CardTitle className="text-lg flex items-center gap-2">
            <Mic2 className="w-5 h-5 text-indigo-500" /> Team Standup Monitoring
          </CardTitle>
          <CardDescription>Latest updates and blocker escalations</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        {standups.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground border border-dashed rounded-lg">
            No standup updates recorded for the active sprint.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {standups.map((update: any, idx: number) => (
              <StandupUpdateCard key={idx} update={update} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
