import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import type { Filter, Task } from './types'
import NotesView from './components/NotesView'

const STORAGE_KEY = 'tidy-tasks'

const starterTasks: Task[] = [
  { id: 'welcome-1', title: 'Plan the week ahead', completed: false, createdAt: 1 },
  { id: 'welcome-2', title: 'Make time for a proper lunch', completed: true, createdAt: 2 },
  { id: 'welcome-3', title: 'Reply to outstanding messages', completed: false, createdAt: 3 },
]

function loadTasks(): Task[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? (JSON.parse(saved) as Task[]) : starterTasks
  } catch {
    return starterTasks
  }
}

function App() {
  const [section, setSection] = useState<'tasks' | 'notes'>('tasks')
  const [tasks, setTasks] = useState<Task[]>(loadTasks)
  const [newTask, setNewTask] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingTitle, setEditingTitle] = useState('')
  const [filter, setFilter] = useState<Filter>('all')
  const [query, setQuery] = useState('')

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
  }, [tasks])

  const activeCount = tasks.filter((task) => !task.completed).length
  const completedCount = tasks.length - activeCount
  const progress = tasks.length ? Math.round((completedCount / tasks.length) * 100) : 0

  const visibleTasks = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    return tasks.filter((task) => {
      const matchesFilter = filter === 'all' || (filter === 'active' ? !task.completed : task.completed)
      const matchesSearch = !normalizedQuery || task.title.toLowerCase().includes(normalizedQuery)
      return matchesFilter && matchesSearch
    })
  }, [filter, query, tasks])

  function addTask(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const title = newTask.trim()
    if (!title) return
    setTasks((current) => [...current, { id: crypto.randomUUID(), title, completed: false, createdAt: Date.now() }])
    setNewTask('')
  }

  function toggleTask(id: string) {
    setTasks((current) => current.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task)))
  }

  function deleteTask(id: string) {
    setTasks((current) => current.filter((task) => task.id !== id))
    if (editingId === id) setEditingId(null)
  }

  function startEditing(task: Task) {
    setEditingId(task.id)
    setEditingTitle(task.title)
  }

  function saveEdit(id: string) {
    const title = editingTitle.trim()
    if (!title) return
    setTasks((current) => current.map((task) => (task.id === id ? { ...task, title } : task)))
    setEditingId(null)
  }

  function handleEditKeyDown(event: React.KeyboardEvent<HTMLInputElement>, id: string) {
    if (event.key === 'Enter') saveEdit(id)
    if (event.key === 'Escape') setEditingId(null)
  }

  return (
    <main className="min-h-screen px-4 py-6 text-ink sm:px-8 sm:py-10">
      <div className="mx-auto max-w-5xl">
        <header className="mb-12 flex items-start justify-between gap-6 sm:mb-16">
          <div>
            <div className="mb-5 flex items-center gap-3">
              <span className="brand-mark" aria-hidden="true">✦</span>
              <span className="font-display text-lg font-bold tracking-tight">tidy</span>
            </div>
            <p className="eyebrow">Tuesday, September 29</p>
            <h1 className="mt-2 max-w-xl font-display text-4xl font-bold leading-[1.06] tracking-[-0.04em] sm:text-6xl">
              A little more <span className="text-coral">done.</span>
            </h1>
          </div>
          <div className="hidden rounded-2xl border border-line bg-white/60 px-4 py-3 text-right shadow-sm sm:block">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">Your progress</p>
            <p className="mt-1 font-display text-2xl font-bold">{progress}%</p>
          </div>
        </header>

        <nav aria-label="Workspace" className="workspace-nav mb-8 flex w-fit gap-1 rounded-xl bg-sand p-1">
          {(['tasks', 'notes'] as const).map((item) => (
            <button key={item} type="button" aria-pressed={section === item} aria-controls={`${item}-workspace`} onClick={() => setSection(item)} className={`workspace-button rounded-lg px-5 py-2.5 text-sm font-bold capitalize ${section === item ? 'bg-white text-ink shadow-sm' : 'text-muted'}`}>{item}</button>
          ))}
        </nav>
        <div id="tasks-workspace" hidden={section !== 'tasks'} className="section-panel">
        <section aria-label="Tasks" className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-start">
          <div className="min-w-0">
            <form onSubmit={addTask} className="composer mb-8 flex items-center gap-3 rounded-2xl border border-line bg-white p-2 pl-4 shadow-[0_12px_35px_rgba(43,38,34,0.06)]">
              <span className="text-2xl font-light text-coral" aria-hidden="true">＋</span>
              <label className="sr-only" htmlFor="new-task">Add a new task</label>
              <input id="new-task" value={newTask} onChange={(event) => setNewTask(event.target.value)} placeholder="What needs doing?" className="min-w-0 flex-1 bg-transparent py-3 text-[15px] outline-none placeholder:text-muted/70" />
              <button type="submit" className="rounded-xl bg-ink px-4 py-3 text-sm font-bold text-white transition hover:bg-coral  focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-coral">Add task</button>
            </form>

            <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="task-filters flex gap-1 rounded-xl bg-sand p-1" role="tablist" aria-label="Filter tasks">
                {(['all', 'active', 'completed'] as Filter[]).map((item) => (
                  <button key={item} type="button" role="tab" aria-selected={filter === item} onClick={() => setFilter(item)} className={`rounded-lg px-3 py-2 text-xs font-bold capitalize transition  focus-visible:outline-2 focus-visible:outline-coral ${filter === item ? 'bg-white text-ink shadow-sm' : 'text-muted hover:text-ink'}`}>
                    {item}
                    <span className="ml-1 text-[10px] text-muted">{item === 'all' ? tasks.length : item === 'active' ? activeCount : completedCount}</span>
                  </button>
                ))}
              </div>
              <label className="search-box flex items-center gap-2 rounded-xl border border-line bg-white px-3 py-2.5 text-muted focus-within:border-coral focus-within:ring-2 focus-within:ring-coral/15">
                <span aria-hidden="true" className="text-base">⌕</span>
                <span className="sr-only">Search tasks</span>
                <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search tasks" className="w-full bg-transparent text-sm outline-none placeholder:text-muted/70" />
              </label>
            </div>

            <div className="mb-3 flex items-center justify-between px-1">
              <h2 className="font-display text-xl font-bold">{filter === 'all' ? 'Your tasks' : `${filter} tasks`}</h2>
              <span className="text-xs font-semibold text-muted">{activeCount} {activeCount === 1 ? 'task' : 'tasks'} left</span>
            </div>

            <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-[0_12px_35px_rgba(43,38,34,0.04)]">
              {visibleTasks.length > 0 ? visibleTasks.map((task) => (
                <article key={task.id} className="task-row group flex items-center gap-3 border-b border-line px-4 py-4 last:border-0 sm:px-5">
                  <button type="button" onClick={() => toggleTask(task.id)} aria-label={task.completed ? `Mark ${task.title} as active` : `Mark ${task.title} as completed`} className={`check flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition  focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-coral ${task.completed ? 'border-coral bg-coral text-white' : 'border-line-strong hover:border-coral'}`}>
                    {task.completed && <span aria-hidden="true" className="text-xs font-bold">✓</span>}
                  </button>
                  {editingId === task.id ? (
                    <input autoFocus value={editingTitle} onChange={(event) => setEditingTitle(event.target.value)} onBlur={() => saveEdit(task.id)} onKeyDown={(event) => handleEditKeyDown(event, task.id)} aria-label="Edit task title" className="min-w-0 flex-1 border-b border-coral bg-transparent py-1 text-[15px] outline-none" />
                  ) : (
                    <span className={`min-w-0 flex-1 text-[15px] leading-6 transition ${task.completed ? 'text-muted line-through decoration-coral/60' : 'text-ink'}`}>{task.title}</span>
                  )}
                  <div className="flex shrink-0 items-center gap-1 opacity-100 sm:opacity-0 sm:transition group-hover:opacity-100 group-focus-within:opacity-100">
                    {editingId !== task.id && <button type="button" onClick={() => startEditing(task)} aria-label={`Edit ${task.title}`} className="icon-button">✎</button>}
                    <button type="button" onClick={() => deleteTask(task.id)} aria-label={`Delete ${task.title}`} className="icon-button danger">×</button>
                  </div>
                </article>
              )) : (
                <div className="empty-state px-6 py-14 text-center">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-peach text-2xl text-coral" aria-hidden="true">✦</div>
                  <h3 className="font-display text-lg font-bold">{query ? 'No matches found' : filter === 'completed' ? 'Nothing completed yet' : 'A clear slate'}</h3>
                  <p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-muted">{query ? 'Try a different word or clear your search.' : 'Add a task above and make your next small step count.'}</p>
                </div>
              )}
            </div>
            {completedCount > 0 && <button type="button" onClick={() => setTasks((current) => current.filter((task) => !task.completed))} className="mt-4 px-1 text-xs font-bold text-muted transition hover:text-coral  focus-visible:outline-2 focus-visible:outline-coral">Clear completed <span aria-hidden="true">→</span></button>}
          </div>

          <aside className="rounded-2xl bg-ink p-5 text-white shadow-[0_18px_40px_rgba(43,38,34,0.12)] lg:mt-20">
            <div className="mb-8 flex items-center justify-between">
              <span className="eyebrow text-white/55">Today</span>
              <span className="rounded-full bg-white/10 px-2.5 py-1 text-xs font-bold text-white/70">{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
            </div>
            <p className="font-display text-2xl font-bold leading-tight">Small steps add up.</p>
            <p className="mt-3 text-sm leading-6 text-white/60">Keep your list light and your attention on the next right thing.</p>
            <div className="mt-8 border-t border-white/10 pt-5">
              <div className="mb-2 flex justify-between text-xs font-bold text-white/65"><span>Daily progress</span><span>{completedCount}/{tasks.length}</span></div>
              <div className="h-2 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-coral transition-all duration-500" style={{ width: `${progress}%` }} /></div>
            </div>
          </aside>
        </section>
        </div>
        <div id="notes-workspace" hidden={section !== 'notes'} className="section-panel">
          <NotesView />
        </div>
        <footer className="mt-14 flex items-center justify-between border-t border-line pt-5 text-xs text-muted"><span>Made for the everyday things.</span><span className="hidden sm:block">Your tasks stay on this device.</span></footer>
      </div>
    </main>
  )
}

export default App
