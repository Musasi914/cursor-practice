import { useState } from 'react'
import type { Book, BookStatus } from '../types/book'
import { BOOK_STATUS_LABEL } from '../statusLabels'

type BookFormProps = {
  book: Book | null
  onPatch: (id: string, patch: Partial<Pick<Book, 'title' | 'status' | 'notes' | 'startedOn' | 'finishedOn'>>) => void
  onDelete: (id: string) => void
  onRequestBack?: () => void
  showBackButton?: boolean
}

const STATUS_ORDER: BookStatus[] = ['unread', 'reading', 'finished']

export function BookForm({
  book,
  onPatch,
  onDelete,
  onRequestBack,
  showBackButton,
}: BookFormProps) {
  const [titleError, setTitleError] = useState(false)

  if (!book) {
    return (
      <section className="reading-form" aria-label="本の登録と編集">
        <p className="reading-form__placeholder">
          左の一覧で本を選ぶか、「新規登録」から追加してください。
        </p>
      </section>
    )
  }

  const id = book.id
  const canSave = book.title.trim().length > 0

  const handleDelete = () => {
    if (window.confirm('この本の記録を削除します。よろしいですか？')) {
      onDelete(id)
    }
  }

  const handleSaveClick = () => {
    if (!canSave) {
      setTitleError(true)
      return
    }
    setTitleError(false)
  }

  return (
    <section className="reading-form" aria-label="本の登録と編集">
      <div className="reading-form__toolbar">
        {showBackButton && onRequestBack ? (
          <button
            type="button"
            className="button button--ghost reading-form__back"
            onClick={onRequestBack}
          >
            一覧に戻る
          </button>
        ) : null}
        <div className="reading-form__toolbar-right">
          <button type="button" className="button button--primary" onClick={handleSaveClick}>
            保存
          </button>
          <button type="button" className="button button--danger" onClick={handleDelete}>
            削除
          </button>
        </div>
      </div>
      {titleError ? (
        <p className="reading-form__error" role="alert">
          タイトルは必須です。入力してから保存してください。
        </p>
      ) : null}
      <label className="reading-form__label" htmlFor="book-title">
        タイトル
      </label>
      <input
        id="book-title"
        className="reading-form__input"
        type="text"
        name="title"
        value={book.title}
        onChange={(e) => {
          onPatch(id, { title: e.target.value })
          if (e.target.value.trim().length > 0) {
            setTitleError(false)
          }
        }}
        placeholder="本のタイトル"
        autoComplete="off"
        required
        aria-invalid={titleError || !book.title.trim() ? true : undefined}
        aria-required="true"
      />
      <label className="reading-form__label" htmlFor="book-status">
        読書の状態
      </label>
      <select
        id="book-status"
        className="reading-form__input"
        name="status"
        value={book.status}
        onChange={(e) => onPatch(id, { status: e.target.value as BookStatus })}
        aria-label="読書の状態"
      >
        {STATUS_ORDER.map((s) => (
          <option key={s} value={s}>
            {BOOK_STATUS_LABEL[s]}
          </option>
        ))}
      </select>
      <div className="reading-form__row-dates">
        <p className="reading-form__date-field">
          <label className="reading-form__label" htmlFor="book-started">
            読み始めた日
          </label>
          <input
            id="book-started"
            className="reading-form__input"
            type="date"
            name="startedOn"
            value={book.startedOn ?? ''}
            onChange={(e) => {
              const v = e.target.value
              onPatch(id, { startedOn: v === '' ? null : v })
            }}
          />
        </p>
        <p className="reading-form__date-field">
          <label className="reading-form__label" htmlFor="book-finished">
            読了日
          </label>
          <input
            id="book-finished"
            className="reading-form__input"
            type="date"
            name="finishedOn"
            value={book.finishedOn ?? ''}
            onChange={(e) => {
              const v = e.target.value
              onPatch(id, { finishedOn: v === '' ? null : v })
            }}
          />
        </p>
      </div>
      <label className="reading-form__label" htmlFor="book-notes">
        感想・メモ
      </label>
      <textarea
        id="book-notes"
        className="reading-form__body"
        name="notes"
        value={book.notes}
        onChange={(e) => onPatch(id, { notes: e.target.value })}
        placeholder="感想やメモを自由に"
        rows={12}
      />
    </section>
  )
}
