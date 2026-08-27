import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import api from '@/lib/api';
import { toast } from 'react-hot-toast';
import { AlertTriangle, Trash2, Loader2 } from 'lucide-react';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
}

interface DeleteEmployeeModalProps {
  member: TeamMember | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export default function DeleteEmployeeModal({ member, open, onOpenChange, onSuccess }: DeleteEmployeeModalProps) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!member) return;
    setLoading(true);
    try {
      await api.delete(`/team-members/${member.id}`);
      toast.success(`Employee ${member.name} removed successfully.`);
      if (onSuccess) {
        onSuccess();
      }
      onOpenChange(false);
    } catch (error: any) {
      console.error('Failed to delete member', error);
      toast.error(error.response?.data?.message || 'Failed to remove employee');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[420px] p-0 overflow-hidden border border-rose-500/25 shadow-2xl rounded-2xl bg-card">
        {/* Banner */}
        <div className="p-6 pb-4 bg-gradient-to-br from-rose-500/10 via-rose-500/5 to-transparent border-b border-border/40">
          <DialogHeader>
            <div className="flex items-start gap-3.5">
              <div className="p-3 rounded-2xl bg-rose-500/15 text-rose-600 dark:text-rose-400 ring-4 ring-rose-500/10 shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <DialogTitle className="text-lg font-bold text-foreground">
                  Confirm Delete Employee
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground leading-relaxed">
                  Are you sure you want to remove <span className="font-bold text-foreground">{member?.name}</span>?
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
        </div>

        {/* Body content */}
        <div className="p-6 space-y-4">
          <div className="p-3.5 rounded-xl bg-muted/40 border border-border/60 text-xs space-y-1">
            <p className="text-muted-foreground"><span className="font-semibold text-foreground">Email:</span> {member?.email}</p>
            <p className="text-muted-foreground"><span className="font-semibold text-foreground">Role:</span> {member?.role?.replace('_', ' ')}</p>
            <p className="text-muted-foreground"><span className="font-semibold text-foreground">Department:</span> {member?.department}</p>
          </div>

          <p className="text-xs text-muted-foreground leading-relaxed">
            This employee will be deactivated and removed from the active team directory. They will no longer be able to log in to SprintOS.
          </p>

          <DialogFooter className="pt-2 flex items-center justify-end gap-2.5">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={loading}
              className="rounded-xl h-9 text-xs font-semibold"
            >
              Cancel
            </Button>
            <Button 
              type="button" 
              onClick={handleDelete}
              disabled={loading}
              className="rounded-xl h-9 px-4 text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-500/20 active:scale-[0.98] transition-all"
            >
              {loading ? (
                <span className="flex items-center gap-1.5">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Deleting...
                </span>
              ) : (
                <span className="flex items-center gap-1.5">
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete Employee
                </span>
              )}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
