import { useId } from 'react'
import type { Book } from '../types/book'
import type { BookFilterValue } from '../lib/filterBooks'
import { BookFilterBar } from './BookFilterBar'
import { BookListRow } from './BookListRow'

type ReadingListPanelProps = {
  books: Book[]
  visibleBooks: Book[]
  filter: BookFilterValue
  onFilterChange: (v: BookFilterValue) => void
  search: string
  onSearchChange: (v: string) => void
  selectedId: string | null
  onSelect: (id: string) => void
  onAdd: () => void
  loadCorruption: boolean
  onDismissCorruption: () => void
}

export function ReadingListPanel({
  books,
  visibleBooks,
  filter,
  onFilterChange,
  search,
  onSearchChange,
  selectedId,
  onSelect,
  onAdd,
  loadCorruption,
  onDismissCorruption,
}: ReadingListPanelProps) {
  const searchId = useId()
  const listId = useId()

  return (
    <aside className="reading-sidebar" aria-label="読書の一覧">
      {loadCorruption ? (
        <div className="reading-banner" role="alert">
          <p className="reading-banner__text">
            保存データの形式に不整合があったため、修復に失われた分がある場合があります。必要な本は再登録してください。
          </p>
          <button
            type="button"
            className="button button--ghost reading-banner__close"
            onClick={onDismissCorruption}
          >
            閉じる
          </button>
        </div>
      ) : null}
      <div className="reading-sidebar__header">
        <h1 className="reading-sidebar__title">読書記録</h1>
        <button type="button" className="button button--primary" onClick={onAdd}>
          新規登録
        </button>
      </div>
      <BookFilterBar
        filter={filter}
        onFilterChange={onFilterChange}
        search={search}
        onSearchChange={onSearchChange}
        searchId={searchId}
      />
      {books.length === 0 ? (
        <p className="reading-sidebar__empty">
          まだ本が登録されていません。「新規登録」で紙本・電子籍の記録を始められます。
        </p>
      ) : visibleBooks.length === 0 ? (
        <p className="reading-sidebar__empty" id={listId}>
          条件に一致する本がありません。フィルタやタイトル検索を変えてみてください。
        </p>
      ) : (
        <ul className="reading-list" role="list" aria-label="登録した本">
          {visibleBooks.map((b) => (
            <BookListRow
              key={b.id}
              book={b}
              selected={b.id === selectedId}
              onSelect={onSelect}
              idPrefix={searchId}
            />
          ))}
        </ul>
      )}
    </aside>
  )
}
