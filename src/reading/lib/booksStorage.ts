import type { Book, BookStatus } from '../types/book'

/** 読書記録用 localStorage キー（メモ用 `memo-app:items` とは併用しない） */
export const READING_BOOKS_STORAGE_KEY = 'reading-journal:books' as const

const STATUSES: BookStatus[] = ['unread', 'reading', 'finished']

function isBookStatus(v: unknown): v is BookStatus {
  return typeof v === 'string' && (STATUSES as string[]).includes(v)
}

function isYmdString(v: string) {
  return v !== '' && /^\d{4}-\d{2}-\d{2}$/.test(v)
}

function isOptionalYmdOrNullField(v: unknown): boolean {
  if (v == null) {
    return true
  }
  if (typeof v !== 'string') {
    return false
  }
  if (v === '') {
    return true
  }
  return isYmdString(v)
}

function isValidBook(item: unknown): item is Book {
  if (item === null || typeof item !== 'object') {
    return false
  }
  const o = item as Record<string, unknown>
  if (
    typeof o.id !== 'string' ||
    typeof o.title !== 'string' ||
    !isBookStatus(o.status) ||
    typeof o.notes !== 'string' ||
    typeof o.createdAt !== 'number' ||
    typeof o.updatedAt !== 'number' ||
    !Number.isFinite(o.createdAt) ||
    !Number.isFinite(o.updatedAt) ||
    !isOptionalYmdOrNullField(o.startedOn) ||
    !isOptionalYmdOrNullField(o.finishedOn)
  ) {
    return false
  }
  if (o.startedOn != null && typeof o.startedOn === 'string' && o.startedOn !== '' && !isYmdString(o.startedOn)) {
    return false
  }
  if (o.finishedOn != null && typeof o.finishedOn === 'string' && o.finishedOn !== '' && !isYmdString(o.finishedOn)) {
    return false
  }
  return true
}

export type LoadBooksResult = {
  books: Book[]
  /** JSON 壊損・配列でない等、既定の空配列にフォールバックしたか */
  hadCorruption: boolean
}

/**
 * 起動時の 1 回読み込み。壊損時は `books: []` と `hadCorruption: true`。
 */
export function loadBooksFromStorage(): LoadBooksResult {
  if (typeof window === 'undefined') {
    return { books: [], hadCorruption: false }
  }
  try {
    const raw = window.localStorage.getItem(READING_BOOKS_STORAGE_KEY)
    if (!raw) {
      return { books: [], hadCorruption: false }
    }
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) {
      return { books: [], hadCorruption: true }
    }
    const valid = parsed.filter(isValidBook)
    const books: Book[] = valid.map((b) => ({
      ...b,
      startedOn:
        b.startedOn == null || b.startedOn === '' ? null : b.startedOn,
      finishedOn:
        b.finishedOn == null || b.finishedOn === '' ? null : b.finishedOn,
    }))
    if (valid.length !== parsed.length) {
      return { books, hadCorruption: true }
    }
    return { books, hadCorruption: false }
  } catch {
    return { books: [], hadCorruption: true }
  }
}

export function saveBooksToStorage(books: Book[]) {
  try {
    window.localStorage.setItem(READING_BOOKS_STORAGE_KEY, JSON.stringify(books))
  } catch {
    console.warn(
      '読書データの保存に失敗しました。ブラウザの保存容量制限等をご確認ください。',
    )
  }
}

export function sortBooksByUpdatedAtDesc(books: Book[]): Book[] {
  return [...books].sort((a, b) => b.updatedAt - a.updatedAt)
}
