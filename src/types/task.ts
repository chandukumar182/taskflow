export enum Priority {
  Low = 'low',
  Medium = 'medium',
  High = 'high',
}

export enum FilterStatus {
  All = 'all',
  Active = 'active',
  Completed = 'completed',
}

export enum SortBy {
  Newest = 'newest',
  DueDateAsc = 'due-asc',
  DueDateDesc = 'due-desc',
  PriorityDesc = 'priority-desc',
  PriorityAsc = 'priority-asc',
}

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  dueDate: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TaskInput {
  title: string;
  description: string;
  priority: Priority;
  dueDate: string;
}
