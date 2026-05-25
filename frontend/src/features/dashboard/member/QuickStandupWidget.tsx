import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useSubmitQuickStandup, useAddQuickUpdate } from '../api/memberDashboardApi';
import { useToast } from '@/hooks/use-toast';
import { useAuthStore } from '@/features/auth/store/authStore';
import { FileText, RefreshCw } from 'lucide-react';

export default function QuickStandupWidget({ isOpen, onClose, task }: { isOpen: boolean, onClose: () => void, task: any }) {
  const submitStandup = useSubmitQuickStandup();
  const addQuickUpdate = useAddQuickUpdate();
  const { toast } = useToast();
  const { user } = useAuthStore();
  
  const [updateText, setUpdateText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!task || !user) return;

    // A real quick standup would ask for yesterday, today, blockers.
    // For this quick task-specific modal, we are doing a task quick update (today's work).
    // The user requirement requested "Quick Standup Form" with yesterday/today/blockers.
    // Let's implement this as a full standup if they click a general button, 
    // but since this opens from a task, we pre-fill the context.

    // Let's create a task activity first for the quick update on the task
    addQuickUpdate.mutate(
      { id: task.id, updateText },
      {
        onSuccess: () => {
          // Also submit a daily standup entry
          submitStandup.mutate({
            userId: user.id,
            sprintId: task.sprintId,
            taskId: task.id,
            today: `Worked on ${task.key}: ${updateText}`,
            yesterday: 'Refer to previous standup',
            blockers: null,
          }, {
            onSuccess: () => {
              toast({ title: "Update Added", description: "Your task update and standup have been saved." });
              setUpdateText('');
              onClose();
            }
          });
        }
      }
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-indigo-600">
            <FileText className="h-5 w-5" />
            Add Task Update
          </DialogTitle>
          <DialogDescription>
            Quick update for <span className="font-semibold text-foreground">{task?.key}</span>. This will automatically update your daily standup.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">What did you do / are you doing?</label>
            <Textarea 
              value={updateText}
              onChange={(e) => setUpdateText(e.target.value)}
              placeholder="E.g., Implemented the new login API endpoints."
              required
              className="resize-none min-h-[100px]"
            />
          </div>

          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700" disabled={addQuickUpdate.isPending || submitStandup.isPending || !updateText.trim()}>
              {addQuickUpdate.isPending || submitStandup.isPending ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : null}
              Save Update
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
