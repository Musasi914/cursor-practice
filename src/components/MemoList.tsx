import type { Memo } from '../types/memo'

type MemoListProps = {
  memos: Memo[]
  selectedId: string | null
  onSelect: (id: string) => void
  onAdd: () => void
}

function listTitle(memo: Memo) {
  const t = memo.title.trim()
  return t.length > 0 ? t : '無題'
}

export function MemoList({
  memos,
  selectedId,
  onSelect,
  onAdd,
}: MemoListProps) {
  return (
    <aside className="memo-sidebar" aria-label="メモ一覧">
      <div className="memo-sidebar__header">
        <h1 className="memo-sidebar__title">メモ</h1>
        <button type="button" className="button button--primary" onClick={onAdd}>
          新規
        </button>
      </div>
      {memos.length === 0 ? (
        <p className="memo-sidebar__empty">
          まだメモがありません。「新規」で作成できます。
        </p>
      ) : (
        <ul className="memo-list" role="list">
          {memos.map((memo) => {
            const isActive = memo.id === selectedId
            return (
              <li key={memo.id} className="memo-list__item">
                <button
                  type="button"
                  className={
                    isActive
                      ? 'memo-list__button memo-list__button--active'
                      : 'memo-list__button'
                  }
                  onClick={() => onSelect(memo.id)}
                  aria-current={isActive ? 'true' : undefined}
                >
                  <span className="memo-list__item-title">{listTitle(memo)}</span>
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </aside>
  )
}
