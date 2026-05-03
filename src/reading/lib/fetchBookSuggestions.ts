import type { Book } from '../types/book'

export type BookSuggestion = {
  key: string
  title: string
  reason: string
}

type OpenLibrarySearchDoc = {
  title?: string | string[]
  key?: string
}

function titleFromDoc(doc: OpenLibrarySearchDoc): string {
  const t = doc.title
  if (typeof t === 'string') {
    return t.trim()
  }
  if (Array.isArray(t) && typeof t[0] === 'string') {
    return t[0].trim()
  }
  return ''
}

type OpenLibrarySearchResponse = {
  docs?: OpenLibrarySearchDoc[]
}

function normalizeTitle(t: string) {
  return t.trim().toLowerCase()
}

function tokenizeForQuery(title: string): string[] {
  const parts = title
    .split(/[\s\u3000、,，・/:：-]+/)
    .map((s) => s.trim())
    .filter((s) => s.length >= 2)
  return parts.length > 0 ? parts : [title.trim()].filter((s) => s.length > 0)
}

function buildExcludeSet(books: Book[]) {
  return new Set(books.map((b) => normalizeTitle(b.title)).filter((t) => t.length > 0))
}

/**
 * 読了本のタイトルを種に Open Library の検索 API で候補を取得する（クライアント完結・オプトインなし）。
 * ネットワークエラー時は空配列。
 */
export async function fetchFinishedBookSuggestions(
  books: Book[],
  max = 5,
): Promise<BookSuggestion[]> {
  const finished = books.filter((b) => b.status === 'finished' && b.title.trim().length > 0)
  if (finished.length === 0) {
    return []
  }
  const seed = finished[0]
  const tokens = tokenizeForQuery(seed.title)
  const q = tokens[0] ?? seed.title.trim()
  const exclude = buildExcludeSet(books)

  try {
    const url = `https://openlibrary.org/search.json?limit=12&q=${encodeURIComponent(q)}`
    const res = await fetch(url)
    if (!res.ok) {
      return []
    }
    const json = (await res.json()) as OpenLibrarySearchResponse
    const docs = Array.isArray(json.docs) ? json.docs : []
    const out: BookSuggestion[] = []
    for (const doc of docs) {
      const title = titleFromDoc(doc)
      if (!title) {
        continue
      }
      const n = normalizeTitle(title)
      if (exclude.has(n)) {
        continue
      }
      const key =
        typeof doc.key === 'string' && doc.key.length > 0
          ? doc.key
          : `title:${n}`
      out.push({
        key,
        title,
        reason: `読了「${seed.title.trim()}」に関連する検索結果（Open Library・参考）`,
      })
      if (out.length >= max) {
        break
      }
    }
    return out
  } catch {
    return []
  }
}
