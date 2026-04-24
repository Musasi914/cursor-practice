import type { BookFilterValue } from '../lib/filterBooks'
import { BOOK_STATUS_LABEL } from '../statusLabels'

type BookFilterBarProps = {
  filter: BookFilterValue
  onFilterChange: (v: BookFilterValue) => void
  search: string
  onSearchChange: (v: string) => void
  searchId: string
}

const FILTERS: { value: BookFilterValue; label: string }[] = [
  { value: 'all', label: 'すべて' },
  { value: 'unread', label: BOOK_STATUS_LABEL.unread },
  { value: 'reading', label: BOOK_STATUS_LABEL.reading },
  { value: 'finished', label: BOOK_STATUS_LABEL.finished },
]

export function BookFilterBar({
  filter,
  onFilterChange,
  search,
  onSearchChange,
  searchId,
}: BookFilterBarProps) {
  return (
    <div className="reading-toolbar">
      <fieldset className="reading-filter-fieldset">
        <legend className="reading-assistive">表示する読書状態</legend>
        <div
          className="reading-filter"
          role="radiogroup"
          aria-label="表示する読書状態"
        >
          {FILTERS.map(({ value, label }) => {
            const id = `reading-filter-${value}`
            return (
              <label key={value} className="reading-filter__opt" htmlFor={id}>
                <input
                  id={id}
                  type="radio"
                  className="reading-filter__radio"
                  name="reading-book-filter"
                  value={value}
                  checked={filter === value}
                  onChange={() => onFilterChange(value)}
                />
                <span className="reading-filter__face">{label}</span>
              </label>
            )
          })}
        </div>
      </fieldset>
      <p className="reading-search__wrap">
        <label className="reading-search__label" htmlFor={searchId}>
          タイトル検索
        </label>
        <input
          id={searchId}
          className="reading-search__input"
          type="search"
          name="bookTitleSearch"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="部分一致"
          autoComplete="off"
        />
      </p>
    </div>
  )
}
