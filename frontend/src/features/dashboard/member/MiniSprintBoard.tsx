import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from '@dnd-kit/core';
import {
  SortableContext,
  horizontalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useUpdateTaskStatus } from '../api/memberDashboardApi';
import { Kanban } from 'lucide-react';

const COLUMNS = [
  { id: 'TODO', title: 'To Do', color: 'bg-slate-100 dark:bg-slate-800' },
  { id: 'IN_PROGRESS', title: 'In Progress', color: 'bg-sky-50 dark:bg-sky-900/20' },
  { id: 'IN_REVIEW', title: 'Review', color: 'bg-amber-50 dark:bg-amber-900/20' },
  { id: 'DONE', title: 'Done', color: 'bg-emerald-50 dark:bg-emerald-900/20' },
];

function SortableTaskCard({ task }: { task: any }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id, data: { task } });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <Card 
      ref={setNodeRef} 
      style={style} 
      {...attributes} 
      {...listeners}
      className={`mb-2 cursor-grab active:cursor-grabbing hover:shadow-sm border-l-2 ${task.priority === 'HIGH' || task.priority === 'URGENT' ? 'border-l-rose-500' : 'border-l-indigo-500'}`}
    >
      <CardContent className="p-3">
        <div className="flex justify-between items-start mb-1">
          <span className="text-[10px] font-semibold text-muted-foreground">{task.key}</span>
          {task.storyPoints && (
            <Badge variant="outline" className="text-[8px] h-4 px-1">{task.storyPoints}</Badge>
          )}
        </div>
        <p className="text-xs font-medium leading-tight line-clamp-2">{task.title}</p>
      </CardContent>
    </Card>
  );
}

export default function MiniSprintBoard({ tasks }: { tasks: any[] }) {
  const [boardTasks, setBoardTasks] = useState(tasks);
  const [activeTask, setActiveTask] = useState<any | null>(null);
  
  const updateStatus = useUpdateTaskStatus();

  useEffect(() => {
    setBoardTasks(tasks);
  }, [tasks]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor)
  );

  const handleDragStart = (event: any) => {
    const { active } = event;
    const task = boardTasks.find((t) => t.id === active.id);
    setActiveTask(task);
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;

    // We use a custom sorting logic to allow moving across columns easily
    const activeTaskId = active.id;
    const overId = over.id;

    // Find if over is a column or a task
    const isOverColumn = COLUMNS.some(c => c.id === overId);
    
    let newStatus = '';
    if (isOverColumn) {
      newStatus = overId;
    } else {
      const overTask = boardTasks.find(t => t.id === overId);
      if (overTask) {
        newStatus = overTask.status;
      }
    }

    if (newStatus && activeTask && activeTask.status !== newStatus) {
      // Optimistic update
      setBoardTasks(prev => 
        prev.map(t => t.id === activeTaskId ? { ...t, status: newStatus } : t)
      );
      
      updateStatus.mutate({ id: activeTaskId, status: newStatus });
    }
  };

  return (
    <Card className="bg-card shadow-soft border-muted mt-6 col-span-full">
      <CardHeader className="pb-2 pt-4 px-4 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Kanban className="h-5 w-5 text-indigo-500" />
            <CardTitle className="text-lg">My Sprint Board</CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 overflow-x-auto">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="flex gap-4 min-w-[800px] h-[350px]">
            {COLUMNS.map((column) => {
              const columnTasks = boardTasks.filter(t => t.status === column.id || (column.id === 'DONE' && t.status === 'DONE'));
              
              return (
                <div key={column.id} className={`flex-1 flex flex-col rounded-md p-2 ${column.color}`}>
                  <div className="flex justify-between items-center mb-3 px-1">
                    <h3 className="text-xs font-bold uppercase tracking-wider">{column.title}</h3>
                    <Badge variant="secondary" className="text-[10px]">{columnTasks.length}</Badge>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto">
                    {/* We use the column ID as a droppable zone if empty */}
                    <SortableContext 
                      id={column.id}
                      items={columnTasks.map(t => t.id)}
                      strategy={horizontalListSortingStrategy}
                    >
                      <div className="min-h-[200px] p-1">
                        {columnTasks.map(t => (
                          <SortableTaskCard key={t.id} task={t} />
                        ))}
                      </div>
                    </SortableContext>
                  </div>
                </div>
              );
            })}
          </div>

          <DragOverlay>
            {activeTask ? (
              <Card className="cursor-grabbing shadow-lg border-l-2 border-l-indigo-500 w-[200px] opacity-80">
                <CardContent className="p-3">
                  <div className="text-[10px] font-semibold text-muted-foreground mb-1">{activeTask.key}</div>
                  <p className="text-xs font-medium leading-tight">{activeTask.title}</p>
                </CardContent>
              </Card>
            ) : null}
          </DragOverlay>
        </DndContext>
      </CardContent>
    </Card>
  );
}
