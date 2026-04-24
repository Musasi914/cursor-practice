export type BookStatus = 'unread' | 'reading' | 'finished'

export type Book = {
  id: string
  title: string
  status: BookStatus
  notes: string
  /** 読み始めた日。未入力は `null`。値は日付部分のみ YYYY-MM-DD 形式で統一 */
  startedOn: string | null
  /** 読了日。未入力は `null` */
  finishedOn: string | null
  createdAt: number
  updatedAt: number
}
