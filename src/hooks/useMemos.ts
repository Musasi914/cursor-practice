import { useCallback, useEffect, useRef, useState } from 'react'
import type { Memo } from '../types/memo'

const STORAGE_KEY = 'memo-app:items'
const SAVE_DEBOUNCE_MS = 150

function loadFromStorage(): Memo[] {
  if (typeof window === 'undefined') {
    return []
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      return []
    }
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) {
      return []
    }
    return parsed.filter(
      (item): item is Memo =>
        item !== null &&
        typeof item === 'object' &&
        typeof (item as Memo).id === 'string' &&
        typeof (item as Memo).title === 'string' &&
        typeof (item as Memo).body === 'string' &&
        typeof (item as Memo).updatedAt === 'number',
    )
  } catch {
    console.warn('メモの読み込みに失敗しました。ストレージを空に扱います。')
    return []
  }
}

function saveToStorage(memos: Memo[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(memos))
  } catch {
    console.warn('メモの保存に失敗しました。ブラウザの保存容量制限等をご確認ください。')
  }
}

function sortByUpdatedAtDesc(a: Memo, b: Memo) {
  return b.updatedAt - a.updatedAt
}

export function useMemos() {
  const [memos, setMemos] = useState<Memo[]>(() => loadFromStorage())
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current)
    }
    saveTimerRef.current = setTimeout(() => {
      saveToStorage(memos)
      saveTimerRef.current = null
    }, SAVE_DEBOUNCE_MS)
    return () => {
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current)
        saveTimerRef.current = null
      }
    }
  }, [memos])

  const addMemo = useCallback((): string => {
    const id = crypto.randomUUID()
    const now = Date.now()
    setMemos((prev) => [{ id, title: '', body: '', updatedAt: now }, ...prev])
    return id
  }, [])

  const updateMemo = useCallback(
    (id: string, patch: { title: string; body: string }) => {
      const now = Date.now()
      setMemos((prev) =>
        prev
          .map((m) =>
            m.id === id
              ? { ...m, title: patch.title, body: patch.body, updatedAt: now }
              : m,
          )
          .sort(sortByUpdatedAtDesc),
      )
    },
    [],
  )

  const removeMemo = useCallback((id: string) => {
    setMemos((prev) => prev.filter((m) => m.id !== id))
  }, [])

  return { memos, addMemo, updateMemo, removeMemo }
}
