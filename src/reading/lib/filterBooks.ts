import type { Book, BookStatus } from '../types/book'

export type BookFilterValue = 'all' | BookStatus

export function filterBooks(
  books: Book[],
  filter: BookFilterValue,
  titleQuery: string,
): Book[] {
  const q = titleQuery.trim().toLowerCase()
  let list = books
  if (filter !== 'all') {
    list = list.filter((b) => b.status === filter)
  }
  if (q) {
    list = list.filter((b) => b.title.toLowerCase().includes(q))
  }
  return list
}
