import { useCallback, useId, useRef, type KeyboardEvent } from 'react'
import type { Book } from '../types/book'
import type { BookFilterValue } from '../lib/filterBooks'
import type { BookSortOption } from '../lib/sortBooks'
import { BookFilterBar } from './BookFilterBar'
import { BookListRow } from './BookListRow'

type ReadingListPanelProps = {
  books: Book[]
  visibleBooks: Book[]
  filter: BookFilterValue
  onFilterChange: (v: BookFilterValue) => void
  sort: BookSortOption
  onSortChange: (v: BookSortOption) => void
  search: string
  onSearchChange: (v: string) => void
  selectedId: string | null
  onSelect: (id: string) => void
  onAdd: () => void
  loadCorruption: boolean
  onDismissCorruption: () => void
  saveError: boolean
  onDismissSaveError: () => void
  onRetrySave: () => void
}

export function ReadingListPanel({
  books,
  visibleBooks,
  filter,
  onFilterChange,
  sort,
  onSortChange,
  search,
  onSearchChange,
  selectedId,
  onSelect,
  onAdd,
  loadCorruption,
  onDismissCorruption,
  saveError,
  onDismissSaveError,
  onRetrySave,
}: ReadingListPanelProps) {
  const searchId = useId()
  const listId = useId()
  const listRef = useRef<HTMLUListElement>(null)

  const handleListKeyDownCapture = useCallback(
    (e: KeyboardEvent<HTMLUListElement>) => {
      const target = e.target
      if (!(target instanceof HTMLButtonElement)) {
        return
      }
      if (!target.classList.contains('reading-list__button')) {
        return
      }
      const root = listRef.current
      if (!root) {
        return
      }
      const buttons = [
        ...root.querySelectorAll<HTMLButtonElement>('.reading-list__button'),
      ]
      const idx = buttons.indexOf(target)
      if (idx < 0) {
        return
      }

      const moveFocus = (nextIndex: number) => {
        const i = Math.max(0, Math.min(nextIndex, buttons.length - 1))
        buttons[i]?.focus()
      }

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault()
          moveFocus(idx + 1)
          break
        case 'ArrowUp':
          e.preventDefault()
          moveFocus(idx - 1)
          break
        case 'Home':
          e.preventDefault()
          moveFocus(0)
          break
        case 'End':
          e.preventDefault()
          moveFocus(buttons.length - 1)
          break
        default:
          break
      }
    },
    [],
  )

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
      {saveError ? (
        <div className="reading-banner" role="alert">
          <p className="reading-banner__text">
            読書データの保存に失敗しました。プライベートブラウズや端末の空き容量、
            <a
              className="reading-banner__link"
              href="https://developer.mozilla.org/ja/docs/Web/API/Storage_API/Storage_quotas_and_eviction_criteria"
              target="_blank"
              rel="noreferrer"
            >
              ブラウザの保存クォータ（外部・MDN）
            </a>
            を確認してください。
          </p>
          <div className="reading-banner__actions">
            <button
              type="button"
              className="button button--ghost reading-banner__action"
              onClick={onRetrySave}
            >
              再試行
            </button>
            <button
              type="button"
              className="button button--ghost reading-banner__close"
              onClick={onDismissSaveError}
            >
              閉じる
            </button>
          </div>
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
        sort={sort}
        onSortChange={onSortChange}
        search={search}
        onSearchChange={onSearchChange}
        searchId={searchId}
      />
      {books.length > 0 ? (
        <p className="reading-assistive" aria-live="polite" aria-atomic="true">
          {visibleBooks.length === 0
            ? '条件に一致する本は 0 件です。'
            : `${visibleBooks.length} 件を表示しています。`}
        </p>
      ) : null}
      {books.length === 0 ? (
        <p className="reading-sidebar__empty">
          まだ本が登録されていません。「新規登録」で紙本・電子籍の記録を始められます。
        </p>
      ) : visibleBooks.length === 0 ? (
        <p className="reading-sidebar__empty" id={listId}>
          条件に一致する本がありません。フィルタやタイトル検索を変えてみてください。
        </p>
      ) : (
        <ul
          ref={listRef}
          className="reading-list"
          role="list"
          aria-label="登録した本"
          onKeyDownCapture={handleListKeyDownCapture}
        >
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
