import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAddBlocker } from '../api/memberDashboardApi';
import { useToast } from '@/hooks/use-toast';
import { ShieldAlert, RefreshCw } from 'lucide-react';

export default function BlockerModal({ isOpen, onClose, task }: { isOpen: boolean, onClose: () => void, task: any }) {
  const addBlocker = useAddBlocker();
  const { toast } = useToast();
  
  const [description, setDescription] = useState('');
  const [severity, setSeverity] = useState('HIGH');
  const [type, setType] = useState('TECHNICAL');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!task) return;

    addBlocker.mutate(
      { 
        id: task.id, 
        data: { description, severity, type }
      },
      {
        onSuccess: () => {
          toast({ title: "Blocker Reported", description: "Your blocker has been logged and the team has been notified.", variant: "destructive" });
          setDescription('');
          setSeverity('HIGH');
          setType('TECHNICAL');
          onClose();
        }
      }
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-rose-600">
            <ShieldAlert className="h-5 w-5" />
            Report Blocker
          </DialogTitle>
          <DialogDescription>
            Are you blocked on <span className="font-semibold text-foreground">{task?.key}</span>? Let the team know.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">What is blocking you?</label>
            <Textarea 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="E.g., Waiting on backend API for authentication..."
              required
              className="resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Severity</label>
              <Select value={severity} onValueChange={setSeverity}>
                <SelectTrigger>
                  <SelectValue placeholder="Select severity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="LOW">Low</SelectItem>
                  <SelectItem value="MEDIUM">Medium</SelectItem>
                  <SelectItem value="HIGH">High</SelectItem>
                  <SelectItem value="CRITICAL">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Type</label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TECHNICAL">Technical</SelectItem>
                  <SelectItem value="REQUIREMENT">Requirement</SelectItem>
                  <SelectItem value="DEPENDENCY">Dependency</SelectItem>
                  <SelectItem value="INFRASTRUCTURE">Infrastructure</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" variant="destructive" disabled={addBlocker.isPending || !description.trim()}>
              {addBlocker.isPending ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : null}
              Report Blocker
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
