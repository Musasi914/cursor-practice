import { useEffect, useId, useRef, useState } from 'react'
import { DayPicker } from 'react-day-picker'
import { ja } from 'date-fns/locale/ja'
import 'react-day-picker/style.css'

type BookDateFieldProps = {
  id: string
  label: string
  value: string | null
  onChange: (next: string | null) => void
}

function parseYmdToLocalDate(value: string | null | undefined): Date | undefined {
  if (value == null || value === '' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return undefined
  }
  const [y, m, d] = value.split('-').map(Number)
  return new Date(y, m - 1, d, 12, 0, 0, 0)
}

function toYmdLocal(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function BookDateField({ id, label, value, onChange }: BookDateFieldProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [pickerOpen, setPickerOpen] = useState(false)
  const dialogTitleId = useId()
  const triggerId = useId()

  useEffect(() => {
    const el = dialogRef.current
    if (!el) {
      return
    }
    if (pickerOpen && !el.open) {
      el.showModal()
      return
    }
    if (!pickerOpen && el.open) {
      el.close()
    }
  }, [pickerOpen])

  useEffect(() => {
    const el = dialogRef.current
    if (!el) {
      return
    }
    const onClose = () => setPickerOpen(false)
    el.addEventListener('close', onClose)
    return () => el.removeEventListener('close', onClose)
  }, [])

  const selected = parseYmdToLocalDate(value)

  return (
    <div className="reading-form__date-field-inner">
      <label className="reading-form__label" htmlFor={id}>
        {label}
      </label>
      <div className="reading-form__date-controls">
        <input
          id={id}
          className="reading-form__input reading-form__input--date"
          type="date"
          name={id}
          value={value ?? ''}
          onChange={(e) => {
            const v = e.target.value
            onChange(v === '' ? null : v)
          }}
        />
        <button
          id={triggerId}
          type="button"
          className="button button--ghost reading-form__calendar-trigger"
          onClick={() => setPickerOpen(true)}
          aria-expanded={pickerOpen}
          aria-haspopup="dialog"
          aria-controls={`${id}-calendar-dialog`}
        >
          カレンダー
        </button>
      </div>
      <dialog
        id={`${id}-calendar-dialog`}
        ref={dialogRef}
        className="date-picker-dialog"
        aria-labelledby={dialogTitleId}
      >
        <div className="date-picker-dialog__panel">
          <h2 id={dialogTitleId} className="date-picker-dialog__title">
            {label}を選択
          </h2>
          <DayPicker
            mode="single"
            selected={selected}
            onSelect={(d) => {
              if (d) {
                onChange(toYmdLocal(d))
              }
              setPickerOpen(false)
            }}
            locale={ja}
            defaultMonth={selected ?? new Date()}
            classNames={{
              root: 'rdp-reading',
              month_caption: 'rdp-reading__caption',
            }}
          />
          <div className="date-picker-dialog__footer">
            <button
              type="button"
              className="button button--ghost"
              onClick={() => {
                onChange(null)
                setPickerOpen(false)
              }}
            >
              日付をクリア
            </button>
            <button
              type="button"
              className="button button--ghost"
              onClick={() => setPickerOpen(false)}
            >
              閉じる
            </button>
          </div>
        </div>
      </dialog>
    </div>
  )
}
