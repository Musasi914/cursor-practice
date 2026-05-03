const REMINDER_STORAGE_KEY = 'reading-journal:reminder' as const

export type ReadingReminderSettings = {
  enabled: boolean
  hour: number
  minute: number
}

const DEFAULTS: ReadingReminderSettings = {
  enabled: false,
  hour: 21,
  minute: 0,
}

function clampHour(n: number) {
  return Math.min(23, Math.max(0, Math.floor(n)))
}

function clampMinute(n: number) {
  return Math.min(59, Math.max(0, Math.floor(n)))
}

function isSettings(o: unknown): o is ReadingReminderSettings {
  if (o === null || typeof o !== 'object') {
    return false
  }
  const r = o as Record<string, unknown>
  return (
    typeof r.enabled === 'boolean' &&
    typeof r.hour === 'number' &&
    typeof r.minute === 'number' &&
    Number.isFinite(r.hour) &&
    Number.isFinite(r.minute)
  )
}

export function loadReminderSettings(): ReadingReminderSettings {
  if (typeof window === 'undefined') {
    return { ...DEFAULTS }
  }
  try {
    const raw = window.localStorage.getItem(REMINDER_STORAGE_KEY)
    if (!raw) {
      return { ...DEFAULTS }
    }
    const parsed: unknown = JSON.parse(raw)
    if (!isSettings(parsed)) {
      return { ...DEFAULTS }
    }
    return {
      enabled: parsed.enabled,
      hour: clampHour(parsed.hour),
      minute: clampMinute(parsed.minute),
    }
  } catch {
    return { ...DEFAULTS }
  }
}

export function saveReminderSettings(settings: ReadingReminderSettings) {
  if (typeof window === 'undefined') {
    return
  }
  try {
    window.localStorage.setItem(
      REMINDER_STORAGE_KEY,
      JSON.stringify({
        enabled: settings.enabled,
        hour: clampHour(settings.hour),
        minute: clampMinute(settings.minute),
      }),
    )
  } catch {
    // 補助機能のため保存失敗は握りつぶす
  }
}

export function timeToHmString(hour: number, minute: number) {
  const h = String(clampHour(hour)).padStart(2, '0')
  const m = String(clampMinute(minute)).padStart(2, '0')
  return `${h}:${m}`
}

export function parseHmFromTimeInput(value: string): { hour: number; minute: number } | null {
  const match = /^(\d{1,2}):(\d{2})$/.exec(value.trim())
  if (!match) {
    return null
  }
  const hour = Number(match[1])
  const minute = Number(match[2])
  if (!Number.isFinite(hour) || !Number.isFinite(minute)) {
    return null
  }
  return { hour: clampHour(hour), minute: clampMinute(minute) }
}
