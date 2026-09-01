import { useState, useMemo } from 'react';
import { useTasks } from '../api/taskApi';
import { useProjects } from '@/features/projects/api/projectApi';
import { AdvancedFilterPanel, initialFilterState } from '@/features/filters/AdvancedFilterPanel';
import type { FilterState } from '@/features/filters/AdvancedFilterPanel';
import { CreateTaskModal } from '../components/CreateTaskModal';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, ListFilter, Plus, LayoutList } from 'lucide-react';
import TaskDrawer from '../components/TaskDrawer';
import { TEAM_MEMBERS } from '@/constants/teamMembers';
import { useAuthStore } from '@/features/auth/store/authStore';

export default function TaskListPage() {
  const { data: tasks = [], isLoading } = useTasks();
  const { data: projects = [] } = useProjects();
  const { user } = useAuthStore();
  
  const [search, setSearch] = useState('');
  const [drawerTaskId, setDrawerTaskId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Advanced filters state
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  const [advancedFilters, setAdvancedFilters] = useState<FilterState>(initialFilterState);

  // Filter tasks based on user role
  const isPM = user?.role === 'PRODUCT_MANAGER';
  
  const [sortField, setSortField] = useState<'key' | 'title' | 'status' | 'priority'>('key');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const getKeyNum = (key?: string) => {
    if (!key) return 0;
    const num = parseInt(key.replace(/^[^\d]*/, ''), 10);
    return isNaN(num) ? 0 : num;
  };

  const visibleTasks = useMemo(() => {
    const filtered = tasks.filter((t: any) => {
      // Role permission check
      if (!isPM && t.assigneeId !== user?.id) return false;

      // Search query
      if (search && !t.title.toLowerCase().includes(search.toLowerCase()) && !t.key.toLowerCase().includes(search.toLowerCase())) return false;

      // Priorities
      if (advancedFilters.priorities.length > 0 && !advancedFilters.priorities.includes(t.priority)) return false;

      // Statuses
      if (advancedFilters.statuses.length > 0 && !advancedFilters.statuses.includes(t.status)) return false;

      // Assignees
      if (advancedFilters.assigneeIds.length > 0 && !advancedFilters.assigneeIds.includes(t.assigneeId)) return false;

      // Projects
      if (advancedFilters.projectIds.length > 0 && !advancedFilters.projectIds.includes(t.projectId)) return false;

      // Overdue filter
      if (advancedFilters.isOverdue) {
        if (!t.dueDate || t.status === 'DONE') return false;
        if (new Date(t.dueDate) >= new Date()) return false;
      }

      // Blocked filter
      if (advancedFilters.isBlocked) {
        const hasActiveBlockers = t.blockers && t.blockers.some((b: any) => !b.isResolved);
        if (t.status !== 'BLOCKED' && !hasActiveBlockers) return false;
      }

      return true;
    });

    return filtered.sort((a: any, b: any) => {
      let comparison = 0;
      if (sortField === 'key') {
        comparison = getKeyNum(a.key) - getKeyNum(b.key);
      } else if (sortField === 'title') {
        comparison = a.title.localeCompare(b.title);
      } else if (sortField === 'status') {
        comparison = (a.status || '').localeCompare(b.status || '');
      } else if (sortField === 'priority') {
        const priorityOrder: Record<string, number> = { CRITICAL: 5, URGENT: 4, HIGH: 3, MEDIUM: 2, LOW: 1 };
        comparison = (priorityOrder[a.priority] || 0) - (priorityOrder[b.priority] || 0);
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });
  }, [tasks, search, isPM, user, advancedFilters, sortField, sortOrder]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'CRITICAL': return 'text-red-500';
      case 'URGENT': return 'text-amber-500';
      case 'HIGH': return 'text-orange-500';
      case 'MEDIUM': return 'text-blue-500';
      case 'LOW': return 'text-slate-500';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{isPM ? 'All Tasks' : 'My Tasks'}</h1>
          <p className="text-muted-foreground">Manage and track your assigned work items.</p>
        </div>
        
        {isPM && (
          <Button onClick={() => setIsModalOpen(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-soft">
            <Plus className="w-4 h-4 mr-2" />
            Create Task
          </Button>
        )}
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4 justify-between bg-card p-3 rounded-lg border border-border shadow-sm">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search by ID or title..." 
              className="pl-9 bg-background"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button variant="outline" className="shrink-0 shadow-sm" onClick={() => setIsFilterPanelOpen(true)}>
            <ListFilter className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </div>
      </div>

      <div className="rounded-md border border-border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b border-border select-none">
              <tr>
                <th 
                  className="px-6 py-4 font-medium cursor-pointer hover:text-foreground transition-colors"
                  onClick={() => {
                    if (sortField === 'key') setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
                    else { setSortField('key'); setSortOrder('asc'); }
                  }}
                >
                  Key {sortField === 'key' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
                </th>
                <th 
                  className="px-6 py-4 font-medium cursor-pointer hover:text-foreground transition-colors"
                  onClick={() => {
                    if (sortField === 'title') setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
                    else { setSortField('title'); setSortOrder('asc'); }
                  }}
                >
                  Title {sortField === 'title' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
                </th>
                <th className="px-6 py-4 font-medium">Project</th>
                <th 
                  className="px-6 py-4 font-medium cursor-pointer hover:text-foreground transition-colors"
                  onClick={() => {
                    if (sortField === 'status') setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
                    else { setSortField('status'); setSortOrder('asc'); }
                  }}
                >
                  Status {sortField === 'status' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
                </th>
                <th 
                  className="px-6 py-4 font-medium cursor-pointer hover:text-foreground transition-colors"
                  onClick={() => {
                    if (sortField === 'priority') setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
                    else { setSortField('priority'); setSortOrder('asc'); }
                  }}
                >
                  Priority {sortField === 'priority' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
                </th>
                <th className="px-6 py-4 font-medium">Assignee</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={6} className="text-center py-10">Loading tasks...</td></tr>
              ) : visibleTasks.map((task: any) => {
                const project = projects.find((p: any) => p.id === task.projectId);
                const assignee = TEAM_MEMBERS.find(m => m.id === task.assigneeId);
                
                return (
                  <tr 
                    key={task.id} 
                    className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors cursor-pointer"
                    onClick={() => setDrawerTaskId(task.id)}
                  >
                    <td className="px-6 py-4 font-mono text-xs text-muted-foreground">
                      {task.key}
                    </td>
                    <td className="px-6 py-4 font-medium text-foreground">
                      <span className="hover:text-indigo-600 transition-colors">{task.title}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-muted-foreground">{project?.name}</span>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="outline" className="text-[10px]">
                        {task.status.replace('_', ' ')}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-semibold ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {assignee?.name || 'Unassigned'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        {visibleTasks.length === 0 && !isLoading && (
          <div className="flex flex-col items-center justify-center py-20 text-center border-t border-border border-dashed">
            <LayoutList className="w-10 h-10 text-muted-foreground mb-4 opacity-50" />
            <h3 className="text-lg font-medium">No tasks found</h3>
            <p className="text-muted-foreground max-w-sm mt-1">You don't have any tasks matching the current criteria.</p>
          </div>
        )}
      </div>

      <TaskDrawer taskId={drawerTaskId} onClose={() => setDrawerTaskId(null)} />
      <CreateTaskModal open={isModalOpen} onOpenChange={setIsModalOpen} />
      <AdvancedFilterPanel 
        isOpen={isFilterPanelOpen} 
        onClose={() => setIsFilterPanelOpen(false)} 
        filters={advancedFilters} 
        setFilters={setAdvancedFilters}
        projects={projects}
        isBoardView={false}
      />
    </div>
  );
}
