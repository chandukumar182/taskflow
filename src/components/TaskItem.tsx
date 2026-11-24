import {AlertCircle, Calendar, Check, Pencil, Trash2} from 'lucide-react';
import {Task} from '../types/task';
import {PRIORITY_CONFIG, formatDueDate, isTaskOverdue} from '../utils/taskUtils';

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

export function TaskItem({task, onToggle, onEdit, onDelete}: TaskItemProps) {
  const overdue = isTaskOverdue(task);
  const priorityConfig = PRIORITY_CONFIG[task.priority];

  return (
    <article
      className={`group rounded-2xl border p-4 shadow-xs transition-all duration-150 sm:p-5 ${
        overdue
          ? 'border-red-300 bg-red-50/50 dark:border-red-900/70 dark:bg-red-950/20'
          : task.completed
            ? 'border-slate-200/70 bg-slate-50/70 dark:border-slate-800/70 dark:bg-slate-900/50'
            : 'border-slate-200/90 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700'
      }`}
    >
      <div className="flex items-start gap-3.5">
        <div className="pt-0.5">
          <button
            type="button"
            role="checkbox"
            aria-checked={task.completed}
            aria-label={
              task.completed
                ? `Mark "${task.title}" as pending`
                : `Mark "${task.title}" as completed`
            }
            onClick={() => onToggle(task.id)}
            className={`flex h-6 w-6 items-center justify-center rounded-lg border transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 ${
              task.completed
                ? 'border-indigo-600 bg-indigo-600 text-white dark:border-indigo-500 dark:bg-indigo-500'
                : overdue
                  ? 'border-red-400 bg-white hover:border-red-500 dark:border-red-700 dark:bg-slate-950'
                  : 'border-slate-300 bg-white hover:border-indigo-500 dark:border-slate-600 dark:bg-slate-950 dark:hover:border-indigo-400'
            }`}
          >
            {task.completed && <Check className="h-3.5 w-3.5 stroke-[2.5]" aria-hidden="true" />}
          </button>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <h3
                className={`text-base font-semibold leading-snug break-words transition-colors duration-150 ${
                  task.completed
                    ? 'text-slate-400 line-through dark:text-slate-500'
                    : overdue
                      ? 'text-red-950 dark:text-red-100'
                      : 'text-slate-900 dark:text-slate-100'
                }`}
              >
                {task.title}
              </h3>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                onClick={() => onEdit(task)}
                aria-label={`Edit "${task.title}"`}
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl text-slate-500 transition-colors duration-150 hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
              >
                <Pencil className="h-4 w-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => onDelete(task)}
                aria-label={`Delete "${task.title}"`}
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl text-slate-500 transition-colors duration-150 hover:bg-red-50 hover:text-red-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 dark:text-slate-400 dark:hover:bg-red-950/60 dark:hover:text-red-400"
              >
                <Trash2 className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </div>

          {task.description && (
            <p
              className={`mt-1.5 text-sm leading-relaxed break-words ${
                task.completed
                  ? 'text-slate-400 dark:text-slate-500'
                  : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              {task.description}
            </p>
          )}

          <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2 text-xs">
            <span
              className={`inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 font-semibold ${priorityConfig.badgeClass}`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${priorityConfig.dotClass}`}
                aria-hidden="true"
              />
              <span>{priorityConfig.label}</span>
            </span>

            <span className="text-slate-300 dark:text-slate-700" aria-hidden="true">
              ·
            </span>

            <span
              className={`font-medium ${
                task.completed
                  ? 'text-emerald-700 dark:text-emerald-400'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              {task.completed ? 'Completed' : 'Pending'}
            </span>

            <span className="text-slate-300 dark:text-slate-700" aria-hidden="true">
              ·
            </span>

            {task.dueDate ? (
              <span
                className={`inline-flex items-center gap-1.5 font-mono tabular-nums ${
                  overdue
                    ? 'font-semibold text-red-700 dark:text-red-400'
                    : task.completed
                      ? 'text-slate-400 dark:text-slate-500'
                      : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                {overdue ? (
                  <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                ) : (
                  <Calendar className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                )}
                <span>
                  {formatDueDate(task.dueDate)}
                  {overdue ? ' (Overdue)' : ''}
                </span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-slate-400 dark:text-slate-500">
                <Calendar className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                <span>No due date</span>
              </span>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
