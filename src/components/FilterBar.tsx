import {ArrowUpDown, Search, Trash2, X} from 'lucide-react';
import {FilterStatus, SortBy} from '../types/task';

interface FilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  filterStatus: FilterStatus;
  onFilterChange: (status: FilterStatus) => void;
  sortBy: SortBy;
  onSortChange: (sortBy: SortBy) => void;
  counts: {
    all: number;
    active: number;
    completed: number;
  };
  onClearCompleted: () => void;
}

export function FilterBar({
  searchQuery,
  onSearchChange,
  filterStatus,
  onFilterChange,
  sortBy,
  onSortChange,
  counts,
  onClearCompleted,
}: FilterBarProps) {
  const filterTabs: {value: FilterStatus; label: string; count: number}[] = [
    {value: FilterStatus.All, label: 'All', count: counts.all},
    {value: FilterStatus.Active, label: 'Active', count: counts.active},
    {value: FilterStatus.Completed, label: 'Completed', count: counts.completed},
  ];

  return (
    <section
      aria-label="Filter and sort tasks"
      className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xs transition-colors duration-150 dark:border-slate-800 dark:bg-slate-900"
    >
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <label htmlFor="task-search" className="sr-only">
              Search tasks by title
            </label>
            <Search
              className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400"
              aria-hidden="true"
            />
            <input
              id="task-search"
              type="search"
              value={searchQuery}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Search tasks by title..."
              className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pr-9 pl-10 text-sm text-slate-900 placeholder:text-slate-400 transition-colors duration-150 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-indigo-400 dark:focus:bg-slate-900"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                aria-label="Clear search"
                className="absolute top-1/2 right-2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-200/70 hover:text-slate-700 focus-visible:outline-2 focus-visible:outline-indigo-600 dark:hover:bg-slate-800 dark:hover:text-slate-200"
              >
                <X className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            )}
          </div>

          <div className="relative sm:w-52">
            <label htmlFor="task-sort" className="sr-only">
              Sort tasks
            </label>
            <ArrowUpDown
              className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400"
              aria-hidden="true"
            />
            <select
              id="task-sort"
              value={sortBy}
              onChange={(event) => onSortChange(event.target.value as SortBy)}
              className="h-10 w-full cursor-pointer appearance-none rounded-xl border border-slate-200 bg-slate-50 pr-8 pl-9 text-sm font-medium text-slate-700 transition-colors duration-150 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:focus:border-indigo-400 dark:focus:bg-slate-900"
            >
              <option value={SortBy.Newest}>Sort: Newest first</option>
              <option value={SortBy.DueDateAsc}>Due date: Earliest</option>
              <option value={SortBy.DueDateDesc}>Due date: Latest</option>
              <option value={SortBy.PriorityDesc}>Priority: High to Low</option>
              <option value={SortBy.PriorityAsc}>Priority: Low to High</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-slate-100 pt-3 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800">
          <div
            role="group"
            aria-label="Filter tasks by status"
            className="inline-flex w-full rounded-xl bg-slate-100 p-1 sm:w-auto dark:bg-slate-950"
          >
            {filterTabs.map((tab) => {
              const isActive = filterStatus === tab.value;
              return (
                <button
                  key={tab.value}
                  type="button"
                  onClick={() => onFilterChange(tab.value)}
                  aria-pressed={isActive}
                  className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all duration-150 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-indigo-600 sm:flex-initial ${
                    isActive
                      ? 'bg-white text-slate-900 shadow-xs dark:bg-slate-800 dark:text-slate-100'
                      : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`font-mono text-[11px] tabular-nums ${
                      isActive
                        ? 'text-indigo-600 dark:text-indigo-400'
                        : 'text-slate-400 dark:text-slate-500'
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={onClearCompleted}
            disabled={counts.completed === 0}
            className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border border-slate-200 px-3 text-xs font-semibold text-slate-700 transition-colors duration-150 hover:border-red-200 hover:bg-red-50 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:border-slate-200 disabled:hover:bg-transparent disabled:hover:text-slate-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 whitespace-nowrap shrink-0 dark:border-slate-700 dark:text-slate-300 dark:hover:border-red-900/70 dark:hover:bg-red-950/40 dark:hover:text-red-300 dark:disabled:hover:border-slate-700 dark:disabled:hover:text-slate-300"
          >
            <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Clear all completed</span>
          </button>
        </div>
      </div>
    </section>
  );
}
