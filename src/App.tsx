import {useEffect, useMemo, useRef, useState} from 'react';
import {ConfirmDialog} from './components/ConfirmDialog';
import {EditTaskModal} from './components/EditTaskModal';
import {FilterBar} from './components/FilterBar';
import {Header} from './components/Header';
import {TaskForm} from './components/TaskForm';
import {TaskList} from './components/TaskList';
import {FilterStatus, SortBy, Task, TaskInput} from './types/task';
import {isTaskOverdue, sortTasks} from './utils/taskUtils';

const TASKS_STORAGE_KEY = 'taskflow.tasks.v1';
const THEME_STORAGE_KEY = 'taskflow.theme.v1';

function loadInitialTasks(): Task[] {
  try {
    const raw = window.localStorage.getItem(TASKS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function loadInitialTheme(): boolean {
  try {
    const saved = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (saved === 'dark') return true;
    if (saved === 'light') return false;
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  } catch {
    return false;
  }
}

function generateTaskId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `task-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export default function App() {
  const [tasks, setTasks] = useState<Task[]>(loadInitialTasks);
  const [isDark, setIsDark] = useState<boolean>(loadInitialTheme);

  const [filterStatus, setFilterStatus] = useState<FilterStatus>(FilterStatus.All);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortBy>(SortBy.Newest);

  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const [isClearCompletedOpen, setIsClearCompletedOpen] = useState(false);

  const createTitleInputRef = useRef<HTMLInputElement>(null);

  // Persist tasks to localStorage whenever the task list changes (Read/Persist)
  useEffect(() => {
    try {
      window.localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
    } catch {
      // Ignore storage quota errors gracefully
    }
  }, [tasks]);

  // Sync the .dark class on <html> and persist user theme preference
  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, isDark ? 'dark' : 'light');
    } catch {
      // Ignore storage errors
    }
  }, [isDark]);

  // CREATE: Construct a new Task record with a unique ID and timestamps, and prepend it to state
  function addTask(input: TaskInput) {
    const now = new Date().toISOString();
    const newTask: Task = {
      id: generateTaskId(),
      title: input.title,
      description: input.description,
      priority: input.priority,
      dueDate: input.dueDate,
      completed: false,
      createdAt: now,
      updatedAt: now,
    };
    setTasks((prevTasks) => [newTask, ...prevTasks]);
  }

  // UPDATE: Replace matching task fields by ID and refresh updatedAt timestamp
  function updateTask(id: string, updates: TaskInput) {
    const now = new Date().toISOString();
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id
          ? {
              ...task,
              title: updates.title,
              description: updates.description,
              priority: updates.priority,
              dueDate: updates.dueDate,
              updatedAt: now,
            }
          : task
      )
    );
    setEditingTask(null);
  }

  // UPDATE (Toggle Status): Flip the completed boolean between Pending and Completed for a task
  function toggleTask(id: string) {
    const now = new Date().toISOString();
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id
          ? {...task, completed: !task.completed, updatedAt: now}
          : task
      )
    );
  }

  // DELETE: Remove a single task by ID after user confirmation
  function deleteTask(id: string) {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
    setTaskToDelete(null);
  }

  // DELETE (Bulk): Remove all tasks marked as completed
  function clearCompletedTasks() {
    setTasks((prevTasks) => prevTasks.filter((task) => !task.completed));
    setIsClearCompletedOpen(false);
  }

  const counts = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((task) => task.completed).length;
    const remaining = total - completed;
    const overdue = tasks.filter((task) => isTaskOverdue(task)).length;
    return {total, completed, remaining, overdue};
  }, [tasks]);

  // READ (Filter, Search & Sort): Derive visible tasks without mutating stored task state
  const visibleTasks = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    const filtered = tasks.filter((task) => {
      if (filterStatus === FilterStatus.Active && task.completed) return false;
      if (filterStatus === FilterStatus.Completed && !task.completed) return false;
      if (normalizedQuery && !task.title.toLowerCase().includes(normalizedQuery)) {
        return false;
      }
      return true;
    });

    return sortTasks(filtered, sortBy);
  }, [tasks, filterStatus, searchQuery, sortBy]);

  const handleFocusCreateForm = () => {
    createTitleInputRef.current?.scrollIntoView({behavior: 'smooth', block: 'center'});
    createTitleInputRef.current?.focus();
  };

  const handleResetFilters = () => {
    setFilterStatus(FilterStatus.All);
    setSearchQuery('');
  };

  const hasActiveFilters =
    filterStatus !== FilterStatus.All || searchQuery.trim().length > 0;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 transition-colors duration-150 dark:bg-slate-950 dark:text-slate-100">
      <Header
        isDark={isDark}
        onToggleTheme={() => setIsDark((prev) => !prev)}
        onFocusCreateForm={handleFocusCreateForm}
      />

      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12 lg:gap-8">
          <aside className="space-y-6 lg:sticky lg:top-24 lg:col-span-5">
            <section
              aria-label="Task summary"
              className="grid grid-cols-3 divide-x divide-slate-200/80 rounded-2xl border border-slate-200/90 bg-white shadow-xs dark:divide-slate-800 dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="p-4 text-center sm:text-left">
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  Total
                </p>
                <p className="mt-1 font-mono text-2xl font-semibold tabular-nums text-slate-900 dark:text-slate-100">
                  {counts.total}
                </p>
              </div>
              <div className="p-4 text-center sm:text-left">
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  Remaining
                </p>
                <p className="mt-1 font-mono text-2xl font-semibold tabular-nums text-indigo-600 dark:text-indigo-400">
                  {counts.remaining}
                </p>
              </div>
              <div className="p-4 text-center sm:text-left">
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  Completed
                </p>
                <p className="mt-1 font-mono text-2xl font-semibold tabular-nums text-emerald-600 dark:text-emerald-400">
                  {counts.completed}
                </p>
              </div>
            </section>

            <section
              aria-labelledby="create-task-heading"
              className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs transition-colors duration-150 sm:p-6 dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="mb-4">
                <h2
                  id="create-task-heading"
                  className="text-base font-semibold text-slate-900 dark:text-slate-100"
                >
                  Create Task
                </h2>
                <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                  Add a new task with priority and an optional due date.
                </p>
              </div>

              <TaskForm
                mode="create"
                onSubmit={addTask}
                titleInputRef={createTitleInputRef}
              />
            </section>
          </aside>

          <section aria-label="Task workspace" className="space-y-4 lg:col-span-7">
            {counts.overdue > 0 && (
              <div
                role="status"
                className="flex items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-xs font-medium text-red-800 dark:border-red-900/70 dark:bg-red-950/40 dark:text-red-300"
              >
                <span>
                  You have{' '}
                  <strong className="font-mono font-semibold tabular-nums">
                    {counts.overdue}
                  </strong>{' '}
                  overdue {counts.overdue === 1 ? 'task' : 'tasks'} past due date.
                </span>
              </div>
            )}

            <FilterBar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              filterStatus={filterStatus}
              onFilterChange={setFilterStatus}
              sortBy={sortBy}
              onSortChange={setSortBy}
              counts={{
                all: counts.total,
                active: counts.remaining,
                completed: counts.completed,
              }}
              onClearCompleted={() => setIsClearCompletedOpen(true)}
            />

            <TaskList
              tasks={visibleTasks}
              totalTaskCount={tasks.length}
              hasActiveFilters={hasActiveFilters}
              onToggleTask={toggleTask}
              onEditTask={setEditingTask}
              onDeleteTask={setTaskToDelete}
              onResetFilters={handleResetFilters}
              onFocusCreateForm={handleFocusCreateForm}
            />
          </section>
        </div>
      </main>

      <EditTaskModal
        task={editingTask}
        onSave={updateTask}
        onClose={() => setEditingTask(null)}
      />

      <ConfirmDialog
        isOpen={Boolean(taskToDelete)}
        title="Delete task"
        message={
          taskToDelete
            ? `Are you sure you want to delete "${taskToDelete.title}"? This action cannot be undone.`
            : ''
        }
        confirmLabel="Delete task"
        onConfirm={() => {
          if (taskToDelete) {
            deleteTask(taskToDelete.id);
          }
        }}
        onCancel={() => setTaskToDelete(null)}
      />

      <ConfirmDialog
        isOpen={isClearCompletedOpen}
        title="Clear all completed tasks"
        message={`This will permanently remove ${counts.completed} completed ${
          counts.completed === 1 ? 'task' : 'tasks'
        } from your list.`}
        confirmLabel="Clear completed"
        onConfirm={clearCompletedTasks}
        onCancel={() => setIsClearCompletedOpen(false)}
      />
    </div>
  );
}
