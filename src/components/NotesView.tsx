import { useRef, useState } from 'react'
import type { FormEvent } from 'react'
import type { Note } from '../types'
import { useNotes } from '../hooks/useNotes'

export default function NotesView() {
  const { notes, storageError, saveNote, deleteNote, restoreNote } = useNotes()
  const [editingId, setEditingId] = useState<string | null>(null)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [deletedNote, setDeletedNote] = useState<Note | null>(null)
  const [message, setMessage] = useState('')
  const titleInput = useRef<HTMLInputElement>(null)

  function resetEditor() {
    setEditingId(null)
    setTitle('')
    setContent('')
    titleInput.current?.focus()
  }

  function submitNote(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    saveNote(editingId, title, content)
    setMessage(editingId ? 'Note updated.' : 'Note saved.')
    resetEditor()
  }

  function editNote(note: Note) {
    setEditingId(note.id)
    setTitle(note.title)
    setContent(note.content)
    titleInput.current?.focus()
  }

  function removeNote(note: Note) {
    deleteNote(note.id)
    setDeletedNote(note)
    setMessage(`Deleted ${note.title}. You can undo this deletion.`)
    if (editingId === note.id) resetEditor()
    else titleInput.current?.focus()
  }

  return (
    <section aria-labelledby="notes-heading" className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-start">
      <div className="min-w-0">
        <div className="mb-5 flex items-center justify-between gap-3">
          <h2 id="notes-heading" className="font-display text-xl font-bold">Your notes</h2>
          <span className="text-xs font-semibold text-muted">{notes.length} {notes.length === 1 ? 'note' : 'notes'}</span>
        </div>
        <form onSubmit={submitNote} className="note-editor mb-6 rounded-2xl border border-line bg-white p-5 shadow-sm" aria-labelledby="note-editor-heading">
          <h3 id="note-editor-heading" className="mb-4 font-display text-lg font-bold">{editingId ? 'Edit note' : 'Capture a thought'}</h3>
          <label htmlFor="note-title" className="mb-2 block text-sm font-semibold">Title <span className="font-normal text-muted">(optional)</span></label>
          <input ref={titleInput} id="note-title" value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Untitled note" className="note-field mb-4" />
          <label htmlFor="note-content" className="mb-2 block text-sm font-semibold">Note</label>
          <textarea id="note-content" value={content} onChange={(event) => setContent(event.target.value)} rows={5} placeholder="A thought worth keeping…" className="note-field resize-y" />
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <button type="submit" disabled={!title.trim() && !content.trim()} className="primary-button">{editingId ? 'Save changes' : 'Save note'}</button>
            {(editingId || title || content) && <button type="button" onClick={resetEditor} className="secondary-button">{editingId ? 'Cancel edit' : 'Clear draft'}</button>}
          </div>
        </form>
        {storageError && <p role="alert" className="mb-4 rounded-xl border border-coral bg-peach p-3 text-sm text-ink">Notes could not be saved on this device. Keep this page open and copy your notes before leaving.</p>}
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <p role="status" className="text-sm text-muted">{message}</p>
          {deletedNote && <button type="button" className="secondary-button" onClick={() => {
            restoreNote(deletedNote)
            setDeletedNote(null)
            setMessage('Note restored.')
            titleInput.current?.focus()
          }}>Undo delete</button>}
        </div>
        {notes.length ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {notes.map((note) => (
              <article key={note.id} className="note-card min-w-0 rounded-2xl border border-line bg-white p-5">
                <h3 className="wrap-break-word font-display text-lg font-bold">{note.title}</h3>
                <p className="mt-2 line-clamp-4 whitespace-pre-wrap wrap-break-word text-sm leading-6 text-muted">{note.content || 'No content yet.'}</p>
                <p className="mt-4 text-xs text-muted">Updated <time dateTime={new Date(note.updatedAt).toISOString()}>{new Date(note.updatedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</time></p>
                <div className="mt-4 flex gap-2">
                  <button type="button" className="secondary-button" onClick={() => editNote(note)} aria-label={`Edit note ${note.title}`}>Edit</button>
                  <button type="button" className="secondary-button" onClick={() => removeNote(note)} aria-label={`Delete note ${note.title}`}>Delete</button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="empty-state rounded-2xl border border-dashed border-line-strong px-6 py-12 text-center">
            <div aria-hidden="true" className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-peach text-2xl text-coral">✎</div>
            <h3 className="font-display text-lg font-bold">Room for your next idea</h3>
            <p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-muted">Keep a thought, a plan, or a little reminder. Save your first note above.</p>
          </div>
        )}
      </div>
      <aside className="rounded-2xl bg-ink p-5 text-white shadow-sm lg:mt-12">
        <p className="eyebrow text-white/55">A little space</p>
        <p className="mt-5 font-display text-2xl font-bold leading-tight">Let your thoughts settle.</p>
        <p className="mt-3 text-sm leading-6 text-white/70">A quiet place for the ideas that don’t need a checkbox.</p>
        <p className="mt-8 border-t border-white/10 pt-5 text-xs text-white/70">Your notes stay on this device.</p>
      </aside>
    </section>
  )
}
