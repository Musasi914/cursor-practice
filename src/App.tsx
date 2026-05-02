import { useCallback, useEffect, useMemo, useState } from 'react'
import { BookForm } from './reading/components/BookForm'
import { ReadingListPanel } from './reading/components/ReadingListPanel'
import { ThemeToggle } from './reading/components/ThemeToggle'
import { useBooks } from './reading/hooks/useBooks'
import { filterBooks, type BookFilterValue } from './reading/lib/filterBooks'

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
  const { books, loadCorruption, addBook, updateBook, removeBook, clearLoadCorruption } =
    useBooks()
  const [filter, setFilter] = useState<BookFilterValue>('all')
  const [search, setSearch] = useState('')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [mobilePanel, setMobilePanel] = useState<MobilePanel>('list')
  const isNarrow = useNarrowView()

  const visibleBooks = useMemo(
    () => filterBooks(books, filter, search),
    [books, filter, search],
  )

  const selectedBook = useMemo(
    () => (selectedId ? (books.find((b) => b.id === selectedId) ?? null) : null),
    [books, selectedId],
  )

  const handleAdd = useCallback(() => {
    const id = addBook()
    setSelectedId(id)
    if (isNarrow) {
      setMobilePanel('edit')
    }
  }, [addBook, isNarrow])

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
      removeBook(id)
      setSelectedId((cur) => (cur === id ? null : cur))
      if (isNarrow) {
        setMobilePanel('list')
      }
    },
    [isNarrow, removeBook],
  )

  const showList = !isNarrow || mobilePanel === 'list'
  const showEdit = !isNarrow || mobilePanel === 'edit'

  return (
    <div className="app">
      <div className="app__topbar">
        <ThemeToggle />
      </div>
      <div
        className={
          isNarrow
            ? 'app__main app__main--stack app__main--stack-narrow'
            : 'app__main app__main--stack'
        }
      >
        {showList ? (
          <ReadingListPanel
            books={books}
            visibleBooks={visibleBooks}
            filter={filter}
            onFilterChange={setFilter}
            search={search}
            onSearchChange={setSearch}
            selectedId={selectedId}
            onSelect={handleSelect}
            onAdd={handleAdd}
            loadCorruption={loadCorruption}
            onDismissCorruption={clearLoadCorruption}
          />
        ) : null}
        {showEdit ? (
          <BookForm
            key={selectedId ?? 'none'}
            book={selectedBook}
            onPatch={(id, patch) => {
              updateBook(id, patch)
            }}
            onDelete={handleDelete}
            showBackButton={isNarrow}
            onRequestBack={isNarrow ? () => setMobilePanel('list') : undefined}
          />
        ) : null}
      </div>
    </div>
  )
}
