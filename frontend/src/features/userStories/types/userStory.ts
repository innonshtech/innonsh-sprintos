export interface UserStory {
  id: string;
  featureId: string | null;
  featureName: string | null;
  moduleSection: string | null;
  userType: string | null;
  scenarioId: string | null;
  scenarioName: string | null;
  userStoryExpectedOutput: string | null;
  uiScreenName: string | null;
  uiScreenId: string | null;
  figmaLink: string | null;
  phase: string | null;
  figmaStatus: string | null;
  itStatus: string | null;
  createdById: string | null;
  createdBy?: {
    id: string;
    name: string;
    email: string;
    avatar: string | null;
  } | null;
  updatedById: string | null;
  updatedBy?: {
    id: string;
    name: string;
    email: string;
    avatar: string | null;
  } | null;
  createdAt: string;
  updatedAt: string;
}

export interface UserStoryHistory {
  id: string;
  userStoryId: string;
  userStory?: {
    id: string;
    featureId: string | null;
    featureName: string | null;
  } | null;
  changedById: string | null;
  changedBy?: {
    id: string;
    name: string;
    email: string;
    avatar: string | null;
  } | null;
  field: string;
  oldValue: string | null;
  newValue: string | null;
  action: 'CREATED' | 'UPDATED' | 'DELETED' | 'IMPORTED';
  createdAt: string;
}

export type FigmaStatusOption = 'PENDING' | 'IN_PROGRESS' | 'APPROVED' | 'DONE';
export type ITStatusOption = 'BACKLOG' | 'IN_DEVELOPMENT' | 'TESTING' | 'DEPLOYED' | 'DONE';
