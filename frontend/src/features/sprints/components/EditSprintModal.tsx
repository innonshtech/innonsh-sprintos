import { useState, useEffect } from 'react';
import { useUpdateSprint } from '../api/sprintApi';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { Sprint } from '@/types/core';
import { EnterpriseDatePicker } from '@/components/EnterpriseDatePicker';

interface EditSprintModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sprint: Sprint;
}

export function EditSprintModal({ open, onOpenChange, sprint }: EditSprintModalProps) {
  const updateSprint = useUpdateSprint();
  const { toast } = useToast();
  
  const [name, setName] = useState(sprint.name);
  const [goal, setGoal] = useState(sprint.goal || '');
  const [status, setStatus] = useState(sprint.status || 'PLANNED');
  const [startDate, setStartDate] = useState(sprint.startDate ? new Date(sprint.startDate).toISOString().split('T')[0] : '');
  const [endDate, setEndDate] = useState(sprint.endDate ? new Date(sprint.endDate).toISOString().split('T')[0] : '');

  useEffect(() => {
    if (open) {
      setName(sprint.name);
      setGoal(sprint.goal || '');
      setStatus(sprint.status || 'PLANNED');
      setStartDate(sprint.startDate ? new Date(sprint.startDate).toISOString().split('T')[0] : '');
      setEndDate(sprint.endDate ? new Date(sprint.endDate).toISOString().split('T')[0] : '');
    }
  }, [open, sprint]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await updateSprint.mutateAsync({
        id: sprint.id,
        name,
        goal,
        status: status as any,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
      });
      
      toast({
        title: "Sprint Updated",
        description: "The sprint has been updated successfully.",
      });
      onOpenChange(false);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error updating sprint",
        description: error.response?.data?.error || "An unexpected error occurred."
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Sprint</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-sprint-name" className="text-right">Name</Label>
            <Input id="edit-sprint-name" value={name} onChange={e => setName(e.target.value)} className="col-span-3" required />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-sprint-goal" className="text-right">Goal</Label>
            <Textarea id="edit-sprint-goal" value={goal} onChange={e => setGoal(e.target.value)} className="col-span-3" required />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-sprint-status" className="text-right">Status</Label>
            <select 
              id="edit-sprint-status" 
              value={status} 
              onChange={e => setStatus(e.target.value)} 
              className="col-span-3 flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="PLANNED">Planned</option>
              <option value="ACTIVE">Active</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-sprint-start" className="text-right">Start Date</Label>
            <div className="col-span-3">
               <EnterpriseDatePicker id="edit-sprint-start" value={startDate} onChange={e => setStartDate(e.target.value)} required />
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-sprint-end" className="text-right">End Date</Label>
            <div className="col-span-3">
               <EnterpriseDatePicker id="edit-sprint-end" value={endDate} onChange={e => setEndDate(e.target.value)} required />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white" disabled={updateSprint.isPending}>
              {updateSprint.isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
