import { useCallback, useEffect, useState } from 'react'
import { MemoEditor } from './components/MemoEditor'
import { MemoList } from './components/MemoList'
import { useMemos } from './hooks/useMemos'

const NARROW_MAX = 640

type MobilePanel = 'list' | 'edit'

function useNarrowView() {
  const [isNarrow, setIsNarrow] = useState(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia(`(max-width: ${NARROW_MAX}px)`).matches,
  )

  useEffect(() => {
    const m = window.matchMedia(`(max-width: ${NARROW_MAX}px)`)
    const onChange = () => setIsNarrow(m.matches)
    onChange()
    m.addEventListener('change', onChange)
    return () => m.removeEventListener('change', onChange)
  }, [])

  return isNarrow
}

export default function App() {
  const { memos, addMemo, updateMemo, removeMemo } = useMemos()
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [mobilePanel, setMobilePanel] = useState<MobilePanel>('list')
  const isNarrow = useNarrowView()

  const selectedMemo = selectedId
    ? memos.find((m) => m.id === selectedId) ?? null
    : null

  const handleAdd = useCallback(() => {
    const id = addMemo()
    setSelectedId(id)
    if (isNarrow) {
      setMobilePanel('edit')
    }
  }, [addMemo, isNarrow])

  const handleSelect = useCallback(
    (id: string) => {
      setSelectedId(id)
      if (isNarrow) {
        setMobilePanel('edit')
      }
    },
    [isNarrow],
  )

  const handleDelete = useCallback(
    (id: string) => {
      removeMemo(id)
      setSelectedId((cur) => (cur === id ? null : cur))
      if (isNarrow) {
        setMobilePanel('list')
      }
    },
    [isNarrow, removeMemo],
  )

  const showList = !isNarrow || mobilePanel === 'list'
  const showEdit = !isNarrow || mobilePanel === 'edit'

  return (
    <div className="app">
      <div
        className={
          isNarrow
            ? 'app__main app__main--stack app__main--stack-narrow'
            : 'app__main app__main--stack'
        }
      >
        {showList ? (
          <MemoList
            memos={memos}
            selectedId={selectedId}
            onSelect={handleSelect}
            onAdd={handleAdd}
          />
        ) : null}
        {showEdit ? (
          <MemoEditor
            key={selectedId ?? 'none'}
            memo={selectedMemo}
            onChange={updateMemo}
            onDelete={handleDelete}
            showBackButton={isNarrow}
            onRequestBack={isNarrow ? () => setMobilePanel('list') : undefined}
          />
        ) : null}
      </div>
    </div>
  )
}
