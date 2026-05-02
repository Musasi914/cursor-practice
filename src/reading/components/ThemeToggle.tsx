import { useId, useState } from 'react'
import type { ThemePreference } from '../lib/themeStorage'
import {
  applyThemeToDocument,
  readThemePreference,
  writeThemePreference,
} from '../lib/themeStorage'

const OPTIONS: { value: ThemePreference; label: string }[] = [
  { value: 'system', label: 'システム' },
  { value: 'light', label: 'ライト' },
  { value: 'dark', label: 'ダーク' },
]

export function ThemeToggle() {
  const baseId = useId()
  const [theme, setTheme] = useState<ThemePreference>(() => readThemePreference())

  const handleChange = (next: ThemePreference) => {
    setTheme(next)
    writeThemePreference(next)
    applyThemeToDocument(next)
  }

  return (
    <fieldset className="reading-filter-fieldset app__theme-fieldset">
      <legend className="reading-assistive">配色</legend>
      <div className="reading-filter" role="radiogroup" aria-label="配色">
        {OPTIONS.map(({ value, label }) => {
          const id = `${baseId}-${value}`
          return (
            <label key={value} className="reading-filter__opt" htmlFor={id}>
              <input
                id={id}
                type="radio"
                className="reading-filter__radio"
                name={`reading-theme-${baseId}`}
                value={value}
                checked={theme === value}
                onChange={() => handleChange(value)}
              />
              <span className="reading-filter__face">{label}</span>
            </label>
          )
        })}
      </div>
    </fieldset>
  )
}
