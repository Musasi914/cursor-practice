import { useState } from 'react'
import type { Memo } from '../types/memo'

type MemoEditorProps = {
  memo: Memo | null
  onChange: (id: string, value: { title: string; body: string }) => void
  onDelete: (id: string) => void
  onRequestBack?: () => void
  showBackButton?: boolean
}

export function MemoEditor({
  memo,
  onChange,
  onDelete,
  onRequestBack,
  showBackButton,
}: MemoEditorProps) {
  const [title, setTitle] = useState(() => memo?.title ?? '')
  const [body, setBody] = useState(() => memo?.body ?? '')

  if (!memo) {
    return (
      <section className="memo-editor" aria-label="メモの編集">
        <p className="memo-editor__placeholder">
          左の一覧でメモを選ぶか、「新規」でメモを作成してください。
        </p>
      </section>
    )
  }

  const id = memo.id

  return (
    <section className="memo-editor" aria-label="メモの編集">
      <div className="memo-editor__toolbar">
        {showBackButton && onRequestBack ? (
          <button
            type="button"
            className="button button--ghost memo-editor__back"
            onClick={onRequestBack}
          >
            一覧に戻る
          </button>
        ) : null}
        <button
          type="button"
          className="button button--danger"
          onClick={() => onDelete(id)}
        >
          削除
        </button>
      </div>
      <label className="memo-editor__label" htmlFor="memo-title">
        タイトル
      </label>
      <input
        id="memo-title"
        className="memo-editor__input"
        type="text"
        name="title"
        value={title}
        onChange={(e) => {
          const v = e.target.value
          setTitle(v)
          onChange(id, { title: v, body })
        }}
        placeholder="タイトル"
        autoComplete="off"
      />
      <label className="memo-editor__label" htmlFor="memo-body">
        本文
      </label>
      <textarea
        id="memo-body"
        className="memo-editor__body"
        name="body"
        value={body}
        onChange={(e) => {
          const v = e.target.value
          setBody(v)
          onChange(id, { title, body: v })
        }}
        placeholder="内容を入力…"
        rows={18}
      />
    </section>
  )
}
