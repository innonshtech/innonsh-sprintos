export interface SendTaskAssignedMailParams {
  assigneeEmail: string;
  assigneeName: string;
  projectName: string;
  sprintName: string;
  taskTitle: string;
  taskKey: string;
  priority: string;
  dueDate: string;
  storyPoints: string;
  description: string;
  acceptanceCriteria: string;
  taskId: string;
}
