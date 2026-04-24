import { useCallback, useEffect, useRef, useState } from 'react'
import type { Book, BookStatus } from '../types/book'
import {
  loadBooksFromStorage,
  saveBooksToStorage,
  sortBooksByUpdatedAtDesc,
} from '../lib/booksStorage'

const SAVE_DEBOUNCE_MS = 150

type UpdateBookInput = {
  title?: string
  status?: BookStatus
  notes?: string
  startedOn?: string | null
  finishedOn?: string | null
}

export function useBooks() {
  const initial = loadBooksFromStorage()
  const [books, setBooks] = useState<Book[]>(() =>
    sortBooksByUpdatedAtDesc(initial.books),
  )
  const [loadCorruption, setLoadCorruption] = useState(initial.hadCorruption)
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (loadCorruption) {
      console.warn(
        '読み込みデータの形式に問題があったため、読める分のみ表示し、不整合分は捨てています。',
      )
    }
  }, [loadCorruption])

  useEffect(() => {
    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current)
    }
    saveTimerRef.current = setTimeout(() => {
      saveBooksToStorage(books)
      saveTimerRef.current = null
    }, SAVE_DEBOUNCE_MS)
    return () => {
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current)
        saveTimerRef.current = null
      }
    }
  }, [books])

  const addBook = useCallback((): string => {
    const id = crypto.randomUUID()
    const now = Date.now()
    const row: Book = {
      id,
      title: '',
      status: 'unread',
      notes: '',
      startedOn: null,
      finishedOn: null,
      createdAt: now,
      updatedAt: now,
    }
    setBooks((prev) => sortBooksByUpdatedAtDesc([row, ...prev]))
    return id
  }, [])

  const updateBook = useCallback((id: string, patch: UpdateBookInput) => {
    const now = Date.now()
    setBooks((prev) => {
      const next = prev.map((b) => {
        if (b.id !== id) {
          return b
        }
        return {
          ...b,
          ...patch,
          startedOn: patch.startedOn !== undefined ? patch.startedOn : b.startedOn,
          finishedOn: patch.finishedOn !== undefined ? patch.finishedOn : b.finishedOn,
          updatedAt: now,
        }
      })
      return sortBooksByUpdatedAtDesc(next)
    })
  }, [])

  const removeBook = useCallback((id: string) => {
    setBooks((prev) => prev.filter((b) => b.id !== id))
  }, [])

  const clearLoadCorruption = useCallback(() => {
    setLoadCorruption(false)
  }, [])

  return {
    books,
    loadCorruption,
    addBook,
    updateBook,
    removeBook,
    clearLoadCorruption,
  }
}
