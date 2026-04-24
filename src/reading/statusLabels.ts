import type { BookStatus } from './types/book'

export const BOOK_STATUS_LABEL: Record<BookStatus, string> = {
  unread: '未読',
  reading: '読書中',
  finished: '読了',
}
