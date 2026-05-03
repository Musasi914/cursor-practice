import type { Book } from '../types/book'

export type BookSortOption = 'updated-desc' | 'updated-asc' | 'title-asc' | 'title-desc'

function cmpTitleJa(a: Book, b: Book) {
  return a.title.trim().localeCompare(b.title.trim(), 'ja')
}

export function sortBooksList(books: Book[], sort: BookSortOption): Book[] {
  const next = [...books]
  switch (sort) {
    case 'updated-desc':
      return next.sort((a, b) => b.updatedAt - a.updatedAt)
    case 'updated-asc':
      return next.sort((a, b) => a.updatedAt - b.updatedAt)
    case 'title-asc':
      return next.sort(cmpTitleJa)
    case 'title-desc':
      return next.sort((a, b) => cmpTitleJa(b, a))
    default:
      return next
  }
}
