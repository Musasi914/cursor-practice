/** 読書アプリの配色設定（本データのキーとは別） */
export const READING_THEME_STORAGE_KEY = 'reading-journal:theme' as const

export type ThemePreference = 'system' | 'light' | 'dark'

const VALID: Record<string, true> = {
  system: true,
  light: true,
  dark: true,
}

export function readThemePreference(): ThemePreference {
  if (typeof window === 'undefined') {
    return 'system'
  }
  try {
    const raw = window.localStorage.getItem(READING_THEME_STORAGE_KEY)
    if (raw != null && VALID[raw]) {
      return raw as ThemePreference
    }
  } catch {
    /* quota / private mode */
  }
  return 'system'
}

export function writeThemePreference(theme: ThemePreference): void {
  try {
    window.localStorage.setItem(READING_THEME_STORAGE_KEY, theme)
  } catch {
    /* ignore */
  }
}

export function applyThemeToDocument(theme: ThemePreference): void {
  if (typeof document === 'undefined') {
    return
  }
  document.documentElement.setAttribute('data-theme', theme)
}
