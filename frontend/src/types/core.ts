export type ProjectStatus = 'PLANNING' | 'ACTIVE' | 'ON_HOLD' | 'COMPLETED' | 'ARCHIVED';
export type SprintStatus = 'PLANNED' | 'ACTIVE' | 'COMPLETED' | 'CANCELED';
export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'IN_REVIEW' | 'BLOCKED' | 'TESTING' | 'DONE';
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT' | 'CRITICAL';
export type BlockerSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type BlockerType = 'TECHNICAL' | 'REQUIREMENT' | 'DEPENDENCY' | 'INFRASTRUCTURE' | 'COMMUNICATION' | 'TESTING';

export interface ProjectMember {
  id: string;
  projectId: string;
  userId: string;
  role: string;
}

export interface Project {
  id: string;
  key: string;
  name: string;
  description: string | null;
  status: ProjectStatus;
  ownerId: string;
  members: ProjectMember[];
  createdAt: string;
  updatedAt: string;
}

export interface Sprint {
  id: string;
  name: string;
  goal: string | null;
  startDate: string;
  endDate: string;
  status: SprintStatus;
  projectId: string;
  createdAt: string;
  updatedAt: string;
}

export interface TaskSubtask {
  id: string;
  title: string;
  isCompleted: boolean;
  taskId: string;
  createdAt: string;
}

export interface TaskComment {
  id: string;
  content: string;
  taskId: string;
  userId: string;
  user?: any;
  createdAt: string;
}

export interface TaskActivity {
  id: string;
  action: string;
  field?: string | null;
  oldValue?: string | null;
  newValue?: string | null;
  taskId: string;
  userId?: string | null;
  user?: any;
  createdAt: string;
}

export interface TaskAttachment {
  id: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  taskId: string;
  uploadedById?: string | null;
  createdAt: string;
}

export interface Task {
  id: string;
  key: string;
  title: string;
  description: string | null;
  type: string; // STORY, BUG, TASK, EPIC
  status: TaskStatus | null;
  priority: TaskPriority | null;
  storyPoints: number | null;
  projectId: string;
  sprintId: string | null;
  assigneeId: string | null;
  creatorId: string;
  isArchived?: boolean;
  dueDate?: string | null;
  startDate?: string | null;
  completedAt?: string | null;
  completedById?: string | null;
  acceptanceCriteria?: string | null;
  labels?: string[];
  createdAt: string;
  updatedAt: string;
  // Relations (populated by API)
  project?: any;
  sprint?: any;
  assignee?: any;
  creator?: any;
  subtasks?: TaskSubtask[];
  blockers?: Blocker[];
  comments?: TaskComment[];
  activities?: TaskActivity[];
  standups?: any[];
  attachments?: TaskAttachment[];
}

export interface Blocker {
  id: string;
  description: string;
  isResolved: boolean;
  severity: BlockerSeverity;
  type: BlockerType;
  estimatedResolutionDate: string | null;
  helperId: string | null;
  taskId: string;
  reporterId: string;
  createdAt: string;
  updatedAt: string;
}

export interface DailyStandup {
  id: string;
  date: string;
  yesterday: string;
  today: string;
  blockers: string | null;
  userId: string;
  sprintId: string;
  createdAt: string;
  sprint?: Sprint & { project?: Project };
  task?: Task;
  reportedBlockers?: Blocker[];
}
