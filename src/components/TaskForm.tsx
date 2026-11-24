import {AlertCircle, Plus, Save} from 'lucide-react';
import {FormEvent, RefObject, useEffect, useId, useState} from 'react';
import {Priority, TaskInput} from '../types/task';
import {PRIORITY_CONFIG} from '../utils/taskUtils';

interface TaskFormProps {
  mode: 'create' | 'edit';
  initialValues?: TaskInput;
  onSubmit: (values: TaskInput) => void;
  onCancel?: () => void;
  titleInputRef?: RefObject<HTMLInputElement | null>;
}

const DEFAULT_VALUES: TaskInput = {
  title: '',
  description: '',
  priority: Priority.Medium,
  dueDate: '',
};

export function TaskForm({
  mode,
  initialValues,
  onSubmit,
  onCancel,
  titleInputRef,
}: TaskFormProps) {
  const [title, setTitle] = useState(initialValues?.title ?? DEFAULT_VALUES.title);
  const [description, setDescription] = useState(
    initialValues?.description ?? DEFAULT_VALUES.description
  );
  const [priority, setPriority] = useState<Priority>(
    initialValues?.priority ?? DEFAULT_VALUES.priority
  );
  const [dueDate, setDueDate] = useState(
    initialValues?.dueDate ?? DEFAULT_VALUES.dueDate
  );
  const [titleError, setTitleError] = useState('');

  const formId = useId();
  const titleId = `${formId}-title`;
  const errorId = `${formId}-title-error`;
  const descriptionId = `${formId}-description`;
  const dueDateId = `${formId}-due-date`;

  useEffect(() => {
    if (initialValues) {
      setTitle(initialValues.title);
      setDescription(initialValues.description);
      setPriority(initialValues.priority);
      setDueDate(initialValues.dueDate);
      setTitleError('');
    }
  }, [initialValues]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setTitleError('Task title is required. Please enter a short title.');
      titleInputRef?.current?.focus();
      return;
    }

    onSubmit({
      title: trimmedTitle,
      description: description.trim(),
      priority,
      dueDate,
    });

    if (mode === 'create') {
      setTitle('');
      setDescription('');
      setPriority(Priority.Medium);
      setDueDate('');
      setTitleError('');
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <div>
        <label
          htmlFor={titleId}
          className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200"
        >
          Title <span className="text-red-600 dark:text-red-400" aria-hidden="true">*</span>
        </label>
        <input
          ref={titleInputRef}
          id={titleId}
          type="text"
          value={title}
          onChange={(event) => {
            setTitle(event.target.value);
            if (titleError && event.target.value.trim()) {
              setTitleError('');
            }
          }}
          placeholder="e.g., Finalize Q4 product roadmap"
          aria-required="true"
          aria-invalid={Boolean(titleError)}
          aria-describedby={titleError ? errorId : undefined}
          className={`w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 transition-colors duration-150 focus:outline-none focus:ring-2 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500 ${
            titleError
              ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20 dark:border-red-500'
              : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-500/20 dark:border-slate-700 dark:focus:border-indigo-400'
          }`}
        />
        {titleError && (
          <p
            id={errorId}
            role="alert"
            className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-red-600 dark:text-red-400"
          >
            <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            <span>{titleError}</span>
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor={descriptionId}
          className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200"
        >
          Description <span className="text-xs font-normal text-slate-400">(optional)</span>
        </label>
        <textarea
          id={descriptionId}
          rows={3}
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Add context, links, or checklist notes..."
          className="w-full resize-y rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 transition-colors duration-150 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-indigo-400"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <fieldset>
          <legend className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200">
            Priority
          </legend>
          <div className="grid grid-cols-3 gap-1.5 rounded-xl border border-slate-200 bg-slate-50 p-1 dark:border-slate-700 dark:bg-slate-950">
            {([Priority.Low, Priority.Medium, Priority.High] as const).map((level) => {
              const config = PRIORITY_CONFIG[level];
              const isSelected = priority === level;
              return (
                <button
                  key={level}
                  type="button"
                  onClick={() => setPriority(level)}
                  aria-pressed={isSelected}
                  className={`inline-flex h-9 items-center justify-center gap-1.5 rounded-lg px-2 text-xs font-semibold transition-all duration-150 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-indigo-600 ${
                    isSelected
                      ? 'bg-white text-slate-900 shadow-xs ring-1 ring-slate-200 dark:bg-slate-800 dark:text-slate-100 dark:ring-slate-700'
                      : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
                  }`}
                >
                  <span
                    className={`h-2 w-2 rounded-full ${config.dotClass}`}
                    aria-hidden="true"
                  />
                  <span>{config.label}</span>
                </button>
              );
            })}
          </div>
        </fieldset>

        <div>
          <label
            htmlFor={dueDateId}
            className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200"
          >
            Due Date
          </label>
          <input
            id={dueDateId}
            type="date"
            value={dueDate}
            onChange={(event) => setDueDate(event.target.value)}
            className="h-[46px] w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-900 transition-colors duration-150 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-indigo-400 dark:[color-scheme:dark]"
          />
        </div>
      </div>

      <div className="flex flex-col-reverse gap-2.5 pt-1 sm:flex-row sm:justify-end">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex h-10 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 transition-colors duration-150 hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          className={`inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 text-sm font-semibold text-white shadow-xs transition-colors duration-150 hover:bg-indigo-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:bg-indigo-500 dark:hover:bg-indigo-400 ${
            mode === 'create' ? 'w-full' : ''
          }`}
        >
          {mode === 'create' ? (
            <>
              <Plus className="h-4 w-4" aria-hidden="true" />
              <span>Add Task</span>
            </>
          ) : (
            <>
              <Save className="h-4 w-4" aria-hidden="true" />
              <span>Save Changes</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
