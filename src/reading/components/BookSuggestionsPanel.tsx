import { useEffect, useState } from 'react'
import type { Book } from '../types/book'
import {
  fetchFinishedBookSuggestions,
  type BookSuggestion,
} from '../lib/fetchBookSuggestions'

type BookSuggestionsPanelProps = {
  books: Book[]
}

export function BookSuggestionsPanel({ books }: BookSuggestionsPanelProps) {
  const [items, setItems] = useState<BookSuggestion[]>([])
  const [loading, setLoading] = useState(false)

  const hasFinished = books.some((b) => b.status === 'finished' && b.title.trim().length > 0)

  useEffect(() => {
    if (!hasFinished) {
      return
    }

    let cancelled = false
    const t = window.setTimeout(() => {
      setLoading(true)
      void fetchFinishedBookSuggestions(books, 5)
        .then((suggestions) => {
          if (cancelled) {
            return
          }
          setItems(suggestions)
        })
        .finally(() => {
          if (!cancelled) {
            setLoading(false)
          }
        })
    }, 400)

    return () => {
      cancelled = true
      window.clearTimeout(t)
      setLoading(false)
      setItems([])
    }
  }, [books, hasFinished])

  if (!hasFinished) {
    return null
  }

  return (
    <section className="reading-suggestions" aria-label="読了に基づくおすすめ（参考）">
      <h2 className="reading-suggestions__title">おすすめ（参考）</h2>
      <p className="reading-suggestions__disclaimer">
        Open Library の検索結果です。実在や版の一致は保証されません。
      </p>
      {loading ? (
        <p className="reading-suggestions__status">読み込み中…</p>
      ) : items.length === 0 ? (
        <p className="reading-suggestions__status">
          候補を取得できませんでした。通信状況を確認するか、しばらくしてから再度お試しください。
        </p>
      ) : (
        <ol className="reading-suggestions__list">
          {items.map((s, index) => (
            <li key={`${s.key}-${index}`} className="reading-suggestions__item">
              <span className="reading-suggestions__book-title">{s.title}</span>
              <span className="reading-suggestions__reason">{s.reason}</span>
            </li>
          ))}
        </ol>
      )}
    </section>
  )
}
