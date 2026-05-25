import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { MoreVertical, Edit, Archive, Trash2, CheckCircle2 } from 'lucide-react';
import { EditSprintModal } from './EditSprintModal';
import { DeleteSprintDialog } from './DeleteSprintDialog';
import { useUpdateSprint } from '../api/sprintApi';
import { useToast } from '@/hooks/use-toast';
import type { Sprint } from '@/types/core';

interface SprintActionDropdownProps {
  sprint: Sprint;
}

export function SprintActionDropdown({ sprint }: SprintActionDropdownProps) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  
  const updateSprint = useUpdateSprint();
  const { toast } = useToast();

  const handleComplete = async () => {
    try {
      await updateSprint.mutateAsync({
        id: sprint.id,
        status: 'COMPLETED',
      });
      toast({
        title: "Sprint Completed!",
        description: "Great job completing the sprint.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error completing sprint",
        description: error.response?.data?.error || "An unexpected error occurred."
      });
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon" className="h-9 w-9">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onClick={() => setIsEditOpen(true)} className="cursor-pointer">
            <Edit className="mr-2 h-4 w-4" />
            <span>Edit Sprint</span>
          </DropdownMenuItem>
          {sprint.status !== 'COMPLETED' && (
            <DropdownMenuItem onClick={handleComplete} className="cursor-pointer text-emerald-600 focus:bg-emerald-50 dark:focus:bg-emerald-950">
              <CheckCircle2 className="mr-2 h-4 w-4" />
              <span>Complete Sprint</span>
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setIsDeleteOpen(true)} className="text-red-600 focus:bg-red-50 dark:focus:bg-red-950 cursor-pointer">
            <Trash2 className="mr-2 h-4 w-4" />
            <span>Delete / Archive</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <EditSprintModal open={isEditOpen} onOpenChange={setIsEditOpen} sprint={sprint} />
      <DeleteSprintDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen} sprint={sprint} />
    </>
  );
}
