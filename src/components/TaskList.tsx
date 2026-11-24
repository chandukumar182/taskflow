import {ClipboardList, SearchX} from 'lucide-react';
import {Task} from '../types/task';
import {TaskItem} from './TaskItem';

interface TaskListProps {
  tasks: Task[];
  totalTaskCount: number;
  hasActiveFilters: boolean;
  onToggleTask: (id: string) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (task: Task) => void;
  onResetFilters: () => void;
  onFocusCreateForm: () => void;
}

export function TaskList({
  tasks,
  totalTaskCount,
  hasActiveFilters,
  onToggleTask,
  onEditTask,
  onDeleteTask,
  onResetFilters,
  onFocusCreateForm,
}: TaskListProps) {
  if (totalTaskCount === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center dark:border-slate-700 dark:bg-slate-900">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
          <ClipboardList className="h-6 w-6" aria-hidden="true" />
        </div>
        <h3 className="mt-4 text-base font-semibold text-slate-900 dark:text-slate-100">
          No tasks yet
        </h3>
        <p className="mt-1.5 max-w-sm text-sm text-slate-500 dark:text-slate-400">
          Add your first task with a priority and due date to start organizing your work.
        </p>
        <button
          type="button"
          onClick={onFocusCreateForm}
          className="mt-5 inline-flex h-10 items-center justify-center rounded-xl bg-indigo-600 px-4 text-sm font-semibold text-white shadow-xs transition-colors hover:bg-indigo-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:bg-indigo-500 dark:hover:bg-indigo-400"
        >
          Create your first task
        </button>
      </div>
    );
  }

  if (tasks.length === 0 && hasActiveFilters) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center dark:border-slate-700 dark:bg-slate-900">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
          <SearchX className="h-6 w-6" aria-hidden="true" />
        </div>
        <h3 className="mt-4 text-base font-semibold text-slate-900 dark:text-slate-100">
          No matching tasks
        </h3>
        <p className="mt-1.5 max-w-sm text-sm text-slate-500 dark:text-slate-400">
          Try adjusting your search query or switching the status filter.
        </p>
        <button
          type="button"
          onClick={onResetFilters}
          className="mt-5 inline-flex h-10 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
        >
          Reset filters
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-3" role="list" aria-label="Tasks">
      {tasks.map((task) => (
        <div key={task.id} role="listitem">
          <TaskItem
            task={task}
            onToggle={onToggleTask}
            onEdit={onEditTask}
            onDelete={onDeleteTask}
          />
        </div>
      ))}
    </div>
  );
}
