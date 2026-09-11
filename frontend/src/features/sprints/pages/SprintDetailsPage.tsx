import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useSprint } from '../api/sprintApi';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Clock, AlertTriangle, LayoutDashboard, Target, Users, UserPlus, ExternalLink } from 'lucide-react';
import { SprintActionDropdown } from '../components/SprintActionDropdown';
import { useAuthStore } from '@/features/auth/store/authStore';
import { useTeam } from '@/features/team/api/teamApi';
import { TEAM_MEMBERS } from '@/constants/teamMembers';
import TaskDrawer from '@/features/tasks/components/TaskDrawer';
import { useToast } from '@/hooks/use-toast';

export default function SprintDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: sprint, isLoading } = useSprint(id!);
  const { data: realTeamMembers = [] } = useTeam();
  const { user } = useAuthStore();
  const { toast } = useToast();

  const [drawerTaskId, setDrawerTaskId] = useState<string | null>(null);
  const [isEditMembersOpen, setIsEditMembersOpen] = useState(false);
  const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>([]);

  const allTeamMembers = realTeamMembers.length > 0 ? realTeamMembers : TEAM_MEMBERS;

  if (isLoading) return <div className="flex justify-center p-10">Loading sprint...</div>;
  if (!sprint) return <div>Sprint not found.</div>;

  const project = sprint.project;
  const sprintTasks = sprint.tasks || [];
  
  const completedTasks = sprintTasks.filter(t => t.status === 'DONE').length;
  const totalTasks = sprintTasks.length;
  const progress = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  const activeBlockersCount = sprintTasks.flatMap((t: any) => t.blockers || []).filter((b: any) => !b.isResolved).length;
  
  const totalStoryPoints = sprintTasks.reduce((acc: number, t: any) => acc + (t.storyPoints || 0), 0);
  const completedStoryPoints = sprintTasks.filter((t: any) => t.status === 'DONE').reduce((acc: number, t: any) => acc + (t.storyPoints || 0), 0);

  // Members working on this sprint (derived from tasks assignees + sprint members)
  const taskAssigneeIds = Array.from(new Set(sprintTasks.map((t: any) => t.assigneeId).filter(Boolean)));
  const sprintMemberIds = Array.from(new Set([...(sprint.members?.map((m: any) => m.userId) || []), ...taskAssigneeIds]));
  
  // Working team members objects
  const workingMembers = allTeamMembers.filter((m: any) => 
    sprintMemberIds.includes(m.id) || 
    (selectedMemberIds.length > 0 && selectedMemberIds.includes(m.id)) ||
    sprintTasks.some((t: any) => t.assigneeId === m.id || t.assignee?.id === m.id)
  );

  const handleOpenEditMembers = () => {
    setSelectedMemberIds(workingMembers.map(m => m.id));
    setIsEditMembersOpen(true);
  };

  const handleToggleMember = (memberId: string) => {
    setSelectedMemberIds(prev => 
      prev.includes(memberId) ? prev.filter(i => i !== memberId) : [...prev, memberId]
    );
  };

  const handleSaveMembers = () => {
    toast({
      title: "Sprint Working Members Updated",
      description: `Successfully updated sprint team (${selectedMemberIds.length} working members).`,
    });
    setIsEditMembersOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate(-1)} 
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
            title="Go back"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <Badge variant="outline" className="font-mono text-xs">{project?.key}</Badge>
              <Badge variant={sprint.status === 'ACTIVE' ? 'default' : 'secondary'} className={sprint.status === 'ACTIVE' ? 'bg-indigo-500 text-white border-transparent' : ''}>
                {sprint.status}
              </Badge>
            </div>
            <h1 className="text-3xl font-bold tracking-tight">{sprint.name}</h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/dashboard/boards">
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-soft">
              <LayoutDashboard className="w-4 h-4 mr-2" />
              Go to Board
            </Button>
          </Link>
          {user?.role === 'PRODUCT_MANAGER' && (
            <SprintActionDropdown sprint={sprint} />
          )}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card className="bg-card shadow-soft border-muted md:col-span-3">
          <CardHeader>
            <CardTitle className="text-lg flex items-center text-muted-foreground">
              <Target className="w-4 h-4 mr-2 text-indigo-500" />
              Sprint Goal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-medium text-foreground mb-6">
              {sprint.goal || "No goal defined."}
            </p>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-foreground">Sprint Progress (Story Points)</span>
                <span className="font-bold text-indigo-500">{completedStoryPoints} / {totalStoryPoints} pts</span>
              </div>
              <div className="h-2 w-full bg-muted overflow-hidden rounded-full">
                <div 
                  className="h-full bg-indigo-500 rounded-full transition-all duration-500 ease-in-out" 
                  style={{ width: `${totalStoryPoints === 0 ? 0 : Math.round((completedStoryPoints / totalStoryPoints) * 100)}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground text-right">{progress}% of tasks completed</p>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="bg-card shadow-soft border-muted">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center text-muted-foreground">
                <Clock className="w-4 h-4 mr-2" />
                Time Remaining
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {Math.max(0, Math.ceil((new Date(sprint.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))} days
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {new Date(sprint.startDate).toLocaleDateString()} — {new Date(sprint.endDate).toLocaleDateString()}
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-card shadow-soft border-red-500/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center text-red-500">
                <AlertTriangle className="w-4 h-4 mr-2" />
                Active Blockers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-500">{activeBlockersCount}</div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Working Team Members Card */}
      <Card className="bg-card shadow-soft border-border">
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-500" />
            <span>Working Team Members ({workingMembers.length})</span>
          </CardTitle>
          <Button 
            onClick={handleOpenEditMembers} 
            variant="outline" 
            size="sm"
            className="h-8 text-xs font-semibold gap-1.5 border-indigo-500/30 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-500/10"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Edit Working Members</span>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center gap-3">
            {workingMembers.map((member: any) => (
              <div 
                key={member.id} 
                className="flex items-center gap-2.5 px-3 py-2 bg-muted/30 border border-border/60 rounded-xl hover:border-indigo-500/40 transition-all"
              >
                <Avatar className="w-7 h-7 border border-border">
                  <AvatarImage src={member.avatar} />
                  <AvatarFallback className="text-[10px] font-bold">{(member.name || '?').charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col text-left">
                  <span className="text-xs font-bold text-foreground leading-tight">{member.name || 'Unknown'}</span>
                  <span className="text-[10px] text-muted-foreground">{(member.role || 'MEMBER').replace('_', ' ')}</span>
                </div>
              </div>
            ))}
            {workingMembers.length === 0 && (
              <p className="text-xs text-muted-foreground italic">No team members assigned to this sprint yet.</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Sprint Tasks Overview Table */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Sprint Tasks Overview</h2>
        <div className="rounded-md border border-border bg-card">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b border-border">
                <tr>
                  <th className="px-6 py-4 font-medium">Task</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium text-center">Points</th>
                  <th className="px-6 py-4 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {sprintTasks.map(task => (
                  <tr key={task.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <span className="font-mono text-[10px] text-muted-foreground">{task.key}</span>
                        <span className="font-medium text-foreground">{task.title}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="outline" className="text-[10px]">
                        {task.status.replace('_', ' ')}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-center font-mono">
                      {task.storyPoints || '-'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => setDrawerTaskId(task.id)}
                        className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-500/10"
                      >
                        Details
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {sprintTasks.length === 0 && (
             <div className="flex flex-col items-center justify-center py-10 text-center text-muted-foreground">
              No tasks in this sprint yet.
             </div>
          )}
        </div>
      </div>

      {/* Task Drawer Modal */}
      <TaskDrawer 
        taskId={drawerTaskId} 
        onClose={() => setDrawerTaskId(null)} 
      />

      {/* Edit Sprint Working Members Modal */}
      <Dialog open={isEditMembersOpen} onOpenChange={setIsEditMembersOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-indigo-500" />
              <span>Modify Sprint Team Members</span>
            </DialogTitle>
          </DialogHeader>
          <p className="text-xs text-muted-foreground">
            Select team members assigned to work on {sprint.name}:
          </p>

          <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
            {allTeamMembers.map((member: any) => {
              const isChecked = selectedMemberIds.includes(member.id);
              return (
                <div 
                  key={member.id}
                  onClick={() => handleToggleMember(member.id)}
                  className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                    isChecked 
                      ? 'bg-indigo-500/10 border-indigo-500/40 text-foreground' 
                      : 'bg-card border-border text-muted-foreground hover:bg-accent/40'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="w-8 h-8 border border-border">
                      <AvatarImage src={member.avatar} />
                      <AvatarFallback>{(member.name || '?').charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col text-left">
                      <span className="text-xs font-bold text-foreground">{member.name || 'Unknown'}</span>
                      <span className="text-[10px] text-muted-foreground">{(member.role || 'MEMBER').replace('_', ' ')} • {member.email || ''}</span>
                    </div>
                  </div>
                  <Checkbox checked={isChecked} onCheckedChange={() => handleToggleMember(member.id)} />
                </div>
              );
            })}
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setIsEditMembersOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveMembers} className="bg-indigo-600 hover:bg-indigo-700 text-white">Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
