import { useState } from 'react'
import type { Note } from '../types'

const STORAGE_KEY = 'tidy-notes'

function isNote(value: unknown): value is Note {
  if (!value || typeof value !== 'object') return false
  const note = value as Record<string, unknown>
  return typeof note.id === 'string' && typeof note.title === 'string'
    && typeof note.content === 'string' && typeof note.createdAt === 'number'
    && Number.isFinite(note.createdAt) && typeof note.updatedAt === 'number'
    && Number.isFinite(note.updatedAt)
}

function loadNotes(): Note[] {
  try {
    const saved: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')
    return Array.isArray(saved) ? saved.filter(isNote) : []
  } catch {
    return []
  }
}

export function useNotes() {
  const [notes, setNotes] = useState<Note[]>(loadNotes)
  const [storageError, setStorageError] = useState(false)

  function persistNotes(nextNotes: Note[]) {
    setNotes(nextNotes)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(nextNotes))
      setStorageError(false)
    } catch {
      setStorageError(true)
    }
  }

  function saveNote(id: string | null, title: string, content: string) {
    const now = Date.now()
    const values = { title: title.trim() || 'Untitled note', content: content.trim(), updatedAt: now }
    persistNotes(id
      ? notes.map((note) => note.id === id ? { ...note, ...values } : note)
      : [{ id: crypto.randomUUID(), createdAt: now, ...values }, ...notes])
  }

  function deleteNote(id: string) {
    persistNotes(notes.filter((note) => note.id !== id))
  }

  function restoreNote(note: Note) {
    persistNotes([note, ...notes])
  }

  return { notes, storageError, saveNote, deleteNote, restoreNote }
}
