import {Priority, SortBy, Task} from '../types/task';

export const PRIORITY_WEIGHT: Record<Priority, number> = {
  [Priority.High]: 3,
  [Priority.Medium]: 2,
  [Priority.Low]: 1,
};

export const PRIORITY_CONFIG: Record<
  Priority,
  {label: string; badgeClass: string; dotClass: string}
> = {
  [Priority.Low]: {
    label: 'Low',
    badgeClass:
      'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800/70',
    dotClass: 'bg-emerald-600 dark:bg-emerald-400',
  },
  [Priority.Medium]: {
    label: 'Medium',
    badgeClass:
      'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800/70',
    dotClass: 'bg-amber-500 dark:bg-amber-400',
  },
  [Priority.High]: {
    label: 'High',
    badgeClass:
      'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/60 dark:text-red-300 dark:border-red-800/70',
    dotClass: 'bg-red-600 dark:bg-red-400',
  },
};

export function getTodayLocalISO(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function isTaskOverdue(task: Task): boolean {
  if (task.completed || !task.dueDate) {
    return false;
  }
  return task.dueDate < getTodayLocalISO();
}

export function formatDueDate(dateStr: string): string {
  if (!dateStr) return 'No due date';
  const parts = dateStr.split('-').map(Number);
  if (parts.length !== 3 || parts.some(Number.isNaN)) {
    return dateStr;
  }
  const [year, month, day] = parts;
  const date = new Date(year, month - 1, day);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

export function sortTasks(tasks: Task[], sortBy: SortBy): Task[] {
  return [...tasks].sort((a, b) => {
    switch (sortBy) {
      case SortBy.DueDateAsc: {
        if (!a.dueDate && !b.dueDate) return 0;
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return a.dueDate.localeCompare(b.dueDate);
      }
      case SortBy.DueDateDesc: {
        if (!a.dueDate && !b.dueDate) return 0;
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return b.dueDate.localeCompare(a.dueDate);
      }
      case SortBy.PriorityDesc: {
        const diff = PRIORITY_WEIGHT[b.priority] - PRIORITY_WEIGHT[a.priority];
        if (diff !== 0) return diff;
        return b.createdAt.localeCompare(a.createdAt);
      }
      case SortBy.PriorityAsc: {
        const diff = PRIORITY_WEIGHT[a.priority] - PRIORITY_WEIGHT[b.priority];
        if (diff !== 0) return diff;
        return b.createdAt.localeCompare(a.createdAt);
      }
      case SortBy.Newest:
      default:
        return b.createdAt.localeCompare(a.createdAt);
    }
  });
}
