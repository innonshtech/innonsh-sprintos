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

export interface SendLoginNotificationMailParams {
  userName: string;
  userEmail: string;
  userRole: string;
  department: string;
  loginTime: string;
  ipAddress: string;
  deviceName: string;
  userAgent: string;
}

