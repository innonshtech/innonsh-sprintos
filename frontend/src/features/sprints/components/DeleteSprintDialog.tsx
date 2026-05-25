import { useDeleteSprint, useArchiveSprint } from '../api/sprintApi';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import type { Sprint } from '@/types/core';

interface DeleteSprintDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sprint: Sprint;
}

export function DeleteSprintDialog({ open, onOpenChange, sprint }: DeleteSprintDialogProps) {
  const deleteSprint = useDeleteSprint();
  const archiveSprint = useArchiveSprint();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleHardDelete = async () => {
    try {
      await deleteSprint.mutateAsync(sprint.id);
      toast({
        title: "Sprint Deleted",
        description: "The sprint has been permanently deleted.",
      });
      onOpenChange(false);
      navigate(`/dashboard/projects/${sprint.projectId}`);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error deleting sprint",
        description: error.response?.data?.error || "Failed to delete sprint."
      });
    }
  };

  const handleArchive = async () => {
    try {
      await archiveSprint.mutateAsync({ id: sprint.id, isArchived: true });
      toast({
        title: "Sprint Archived",
        description: "The sprint has been safely archived.",
      });
      onOpenChange(false);
      navigate(`/dashboard/projects/${sprint.projectId}`);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error archiving sprint",
        description: error.response?.data?.error || "Failed to archive sprint."
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-red-600 dark:text-red-400">Danger Zone: Delete Sprint</DialogTitle>
          <DialogDescription className="text-slate-700 dark:text-slate-300">
            You are about to modify <strong>{sprint.name}</strong>.
            <br /><br />
            <strong>Deleting this sprint will remove:</strong>
            <ul className="list-disc pl-5 mt-2 text-sm text-red-500">
              <li>all associated tasks and their history</li>
              <li>all standup entries for this sprint</li>
            </ul>
          </DialogDescription>
        </DialogHeader>
        <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-md text-sm my-2">
          <p>We highly recommend <strong>archiving</strong> the sprint instead of permanently deleting it to retain historical data.</p>
        </div>
        <DialogFooter className="flex-col sm:flex-row gap-2 mt-2">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            type="button" 
            variant="secondary"
            onClick={handleArchive}
            disabled={archiveSprint.isPending || deleteSprint.isPending}
          >
            {archiveSprint.isPending ? 'Archiving...' : 'Archive Sprint'}
          </Button>
          <Button 
            type="button" 
            variant="destructive"
            onClick={handleHardDelete}
            disabled={deleteSprint.isPending || archiveSprint.isPending}
          >
            {deleteSprint.isPending ? 'Deleting...' : 'Hard Delete'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
