import { useState, useEffect } from 'react';
import { useCreateProject } from '../api/projectApi';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAuthStore } from '@/features/auth/store/authStore';
import { useTeam } from '@/features/team/api/teamApi';

interface CreateProjectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateProjectModal({ open, onOpenChange }: CreateProjectModalProps) {
  const { user } = useAuthStore();
  const createProject = useCreateProject();
  const { toast } = useToast();
  const { data: teamMembers = [], isLoading: isLoadingTeam } = useTeam();
  
  const [key, setKey] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [deadline, setDeadline] = useState('');
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);

  useEffect(() => {
    if (user && selectedMembers.length === 0) {
      setSelectedMembers([user.id]);
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    try {
      await createProject.mutateAsync({
        key,
        name,
        description,
        startDate: startDate || undefined,
        deadline: deadline || undefined,
        ownerId: user.id,
        memberIds: selectedMembers,
      });
      
      onOpenChange(false);
      setKey('');
      setName('');
      setDescription('');
      setStartDate('');
      setDeadline('');
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error creating project",
        description: error.response?.data?.error || "An unexpected error occurred."
      });
    }
  };

  const toggleMember = (memberId: string) => {
    if (selectedMembers.includes(memberId)) {
      setSelectedMembers(selectedMembers.filter(id => id !== memberId));
    } else {
      setSelectedMembers([...selectedMembers, memberId]);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Project</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">Name</Label>
            <Input id="name" value={name} onChange={e => setName(e.target.value)} className="col-span-3" required placeholder="e.g. Mobile App Redesign" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="key" className="text-right">Key</Label>
            <Input id="key" value={key} onChange={e => setKey(e.target.value)} className="col-span-3" required placeholder="e.g. MOB" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="desc" className="text-right">Description</Label>
            <Textarea id="desc" value={description} onChange={e => setDescription(e.target.value)} className="col-span-3" placeholder="Project details..." />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="start" className="text-right">Start Date</Label>
            <Input id="start" type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="deadline" className="text-right">Deadline</Label>
            <Input id="deadline" type="date" value={deadline} onChange={e => setDeadline(e.target.value)} className="col-span-3" />
          </div>
          <div className="space-y-2">
            <Label>Team Members</Label>
            <div className="flex flex-wrap gap-2 p-3 border rounded-md max-h-[150px] overflow-y-auto">
              {isLoadingTeam ? (
                <div className="text-sm text-muted-foreground">Loading team...</div>
              ) : teamMembers.length === 0 ? (
                <div className="text-sm text-muted-foreground">No team members found</div>
              ) : (
                teamMembers.map((member: any) => (
                  <div 
                    key={member.id} 
                    onClick={() => toggleMember(member.id)}
                    className={`cursor-pointer px-3 py-1 text-sm rounded-full border ${selectedMembers.includes(member.id) ? 'bg-indigo-100 border-indigo-500 text-indigo-700 dark:bg-indigo-900/30 dark:border-indigo-500 dark:text-indigo-300' : 'bg-background hover:bg-muted'}`}
                  >
                    {member.name}
                  </div>
                ))
              )}
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white" disabled={createProject.isPending}>
              {createProject.isPending ? 'Creating...' : 'Create Project'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
