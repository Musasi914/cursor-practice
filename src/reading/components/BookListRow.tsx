import type { Book } from '../types/book'
import { BOOK_STATUS_LABEL } from '../statusLabels'
import { summarizeNotes } from '../lib/summarizeNotes'

type BookListRowProps = {
  book: Book
  selected: boolean
  onSelect: (id: string) => void
  idPrefix: string
}

function displayTitle(title: string) {
  const t = title.trim()
  return t.length > 0 ? t : '（タイトル未入力）'
}

function formatDateLine(book: Book) {
  const parts: string[] = []
  if (book.startedOn) {
    parts.push(`始 ${book.startedOn}`)
  }
  if (book.finishedOn) {
    parts.push(`了 ${book.finishedOn}`)
  }
  return parts.join(' · ')
}

export function BookListRow({ book, selected, onSelect, idPrefix }: BookListRowProps) {
  const rowId = `${idPrefix}-row-${book.id}`
  const labelId = `${idPrefix}-label-${book.id}`
  const summary = summarizeNotes(book.notes)
  const dateLine = formatDateLine(book)

  return (
    <li className="reading-list__item" role="none">
      <button
        id={rowId}
        type="button"
        className={
          selected
            ? 'reading-list__button reading-list__button--active'
            : 'reading-list__button'
        }
        onClick={() => onSelect(book.id)}
        aria-current={selected ? 'true' : undefined}
        aria-labelledby={labelId}
      >
        <span className="reading-list__title-line">
          <span id={labelId} className="reading-list__item-title">
            {displayTitle(book.title)}
          </span>
          <span
            className="reading-list__status"
            aria-label={`状態: ${BOOK_STATUS_LABEL[book.status]}`}
          >
            {BOOK_STATUS_LABEL[book.status]}
          </span>
        </span>
        {dateLine ? (
          <span className="reading-list__dates" aria-hidden="true">
            {dateLine}
          </span>
        ) : null}
        {summary ? (
          <span className="reading-list__summary" aria-hidden="true">
            {summary}
          </span>
        ) : null}
      </button>
    </li>
  )
}
