const DEFAULT_MAX = 80

/**
 * 一覧用の1行サマリ。改行以降は切り、長い場合は省略。
 */
export function summarizeNotes(notes: string, maxLength = DEFAULT_MAX): string {
  const line = notes.split(/\r?\n/)[0]?.trim() ?? ''
  if (line.length === 0) {
    return ''
  }
  if (line.length <= maxLength) {
    return line
  }
  return `${line.slice(0, maxLength)}…`
}
