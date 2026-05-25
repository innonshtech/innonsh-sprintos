import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useTeamPerformance } from '../hooks/useAdmin';
import { motion } from 'framer-motion';

export const TeamPerformanceMatrix = () => {
  const { data: team, isLoading } = useTeamPerformance();

  if (isLoading) return <div className="h-64 animate-pulse bg-slate-800/50 rounded-xl" />;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Excellent': return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      case 'Healthy': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'At Risk': return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
      case 'Overloaded': return 'bg-red-500/10 text-red-400 border-red-500/20';
      case 'Underutilized': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      default: return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    }
  };

  return (
    <Card className="bg-slate-900/60 border-slate-800 backdrop-blur-xl">
      <CardHeader>
        <CardTitle className="text-xl text-slate-200">Team Performance Matrix</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-sm">
                <th className="pb-3 font-medium px-4">Member</th>
                <th className="pb-3 font-medium px-4">Role</th>
                <th className="pb-3 font-medium px-4 text-center">Tasks</th>
                <th className="pb-3 font-medium px-4 text-center">Overdue</th>
                <th className="pb-3 font-medium px-4 text-center">Blockers</th>
                <th className="pb-3 font-medium px-4 text-center">Productivity</th>
                <th className="pb-3 font-medium px-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {team?.map((member: any, i: number) => (
                <motion.tr 
                  key={member.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors"
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={member.avatar} alt={member.name} />
                        <AvatarFallback className="bg-slate-700 text-xs">{member.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium text-slate-200">{member.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-slate-400 text-sm">{member.role}</td>
                  <td className="py-3 px-4 text-center text-slate-300">
                    <span className="text-green-400 mr-1">{member.completedTasks}</span>/ {member.assignedTasks}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className={member.overdueTasks > 0 ? "text-orange-400 font-medium" : "text-slate-500"}>
                      {member.overdueTasks}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className={member.blockersCount > 0 ? "text-red-400 font-medium" : "text-slate-500"}>
                      {member.blockersCount}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="w-16 h-1.5 bg-slate-800 rounded-full mx-auto overflow-hidden">
                      <div 
                        className={`h-full ${member.productivityScore > 80 ? 'bg-emerald-500' : member.productivityScore > 50 ? 'bg-orange-500' : 'bg-red-500'}`} 
                        style={{ width: `${member.productivityScore}%` }}
                      />
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <Badge variant="outline" className={getStatusColor(member.productivityStatus)}>
                      {member.productivityStatus}
                    </Badge>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};
