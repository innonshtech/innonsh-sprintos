import api from '@/lib/api';

export interface Timesheet {
  id: string;
  userId: string;
  date: string;
  tasksWorkedOn: string;
  hoursWorked: number;
  notes?: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    role: string;
  };
}

export const getTimesheets = async (): Promise<Timesheet[]> => {
  const { data } = await api.get('/timesheets');
  return data.data;
};

export const createTimesheet = async (payload: {
  tasksWorkedOn: string;
  hoursWorked: number;
  notes?: string;
}): Promise<Timesheet> => {
  const { data } = await api.post('/timesheets', payload);
  return data.data;
};
