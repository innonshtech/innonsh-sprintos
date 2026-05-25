import { useDeleteProject, useArchiveProject } from '../api/projectApi';
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
import type { Project } from '@/types/core';

interface DeleteProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project: Project;
}

export function DeleteProjectDialog({ open, onOpenChange, project }: DeleteProjectDialogProps) {
  const deleteProject = useDeleteProject();
  const archiveProject = useArchiveProject();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleHardDelete = async () => {
    try {
      await deleteProject.mutateAsync(project.id);
      toast({
        title: "Project Deleted",
        description: "The project has been permanently deleted.",
      });
      onOpenChange(false);
      navigate('/dashboard'); // Navigate away after deletion
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error deleting project",
        description: error.response?.data?.error || "Failed to delete project."
      });
    }
  };

  const handleArchive = async () => {
    try {
      await archiveProject.mutateAsync({ id: project.id, isArchived: true });
      toast({
        title: "Project Archived",
        description: "The project has been safely archived.",
      });
      onOpenChange(false);
      navigate('/dashboard'); // Navigate away after archiving
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error archiving project",
        description: error.response?.data?.error || "Failed to archive project."
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-red-600 dark:text-red-400">Danger Zone: Delete Project</DialogTitle>
          <DialogDescription className="text-slate-700 dark:text-slate-300">
            You are about to modify <strong>{project.name}</strong>.
            <br /><br />
            <strong>Deleting this project will remove:</strong>
            <ul className="list-disc pl-5 mt-2 text-sm text-red-500">
              <li>all sprints</li>
              <li>all tasks</li>
              <li>all blockers</li>
              <li>all reports</li>
              <li>all sprint history</li>
            </ul>
          </DialogDescription>
        </DialogHeader>
        <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-md text-sm my-2">
          <p>We highly recommend <strong>archiving</strong> the project instead of permanently deleting it to retain historical data.</p>
        </div>
        <DialogFooter className="flex-col sm:flex-row gap-2 mt-2">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            type="button" 
            variant="secondary"
            onClick={handleArchive}
            disabled={archiveProject.isPending || deleteProject.isPending}
          >
            {archiveProject.isPending ? 'Archiving...' : 'Archive Project'}
          </Button>
          <Button 
            type="button" 
            variant="destructive"
            onClick={handleHardDelete}
            disabled={deleteProject.isPending || archiveProject.isPending}
          >
            {deleteProject.isPending ? 'Deleting...' : 'Hard Delete'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
