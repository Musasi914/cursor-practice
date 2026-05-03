import { useEffect, useId, useMemo, useRef, useState } from 'react'
import { useReadingReminder } from '../hooks/useReadingReminder'
import {
  loadReminderSettings,
  parseHmFromTimeInput,
  saveReminderSettings,
  timeToHmString,
  type ReadingReminderSettings,
} from '../lib/readingReminderStorage'

function permissionLabel(permission: NotificationPermission) {
  switch (permission) {
    case 'granted':
      return '許可済み'
    case 'denied':
      return '拒否されています（ブラウザ設定から変更できます）'
    default:
      return '未許可'
  }
}

export function ReadingReminderSettings() {
  const initial = useMemo(() => loadReminderSettings(), [])
  const [settings, setSettings] = useState<ReadingReminderSettings>(initial)
  const [timeStr, setTimeStr] = useState(() =>
    timeToHmString(initial.hour, initial.minute),
  )
  const [dialogOpen, setDialogOpen] = useState(false)
  const [permState, setPermState] = useState<NotificationPermission>(() =>
    typeof Notification !== 'undefined' ? Notification.permission : 'denied',
  )
  const dialogRef = useRef<HTMLDialogElement>(null)
  const titleId = useId()

  useReadingReminder(settings)

  useEffect(() => {
    saveReminderSettings(settings)
  }, [settings])

  useEffect(() => {
    const el = dialogRef.current
    if (!el) {
      return
    }
    if (dialogOpen && !el.open) {
      el.showModal()
      return
    }
    if (!dialogOpen && el.open) {
      el.close()
    }
  }, [dialogOpen])

  useEffect(() => {
    const el = dialogRef.current
    if (!el) {
      return
    }
    const onClose = () => setDialogOpen(false)
    el.addEventListener('close', onClose)
    return () => el.removeEventListener('close', onClose)
  }, [])

  const requestNotifyPermission = async () => {
    if (typeof Notification === 'undefined' || !Notification.requestPermission) {
      return
    }
    const p = await Notification.requestPermission()
    setPermState(p)
    if (p !== 'granted') {
      setSettings((s) => ({ ...s, enabled: false }))
    }
  }

  const applyTimeStr = (raw: string) => {
    const parsed = parseHmFromTimeInput(raw)
    if (!parsed) {
      return
    }
    setTimeStr(timeToHmString(parsed.hour, parsed.minute))
    setSettings((s) => ({ ...s, hour: parsed.hour, minute: parsed.minute }))
  }

  return (
    <>
      <button
        type="button"
        className="button button--ghost reminder-settings-trigger"
        onClick={() => setDialogOpen(true)}
      >
        リマインド
      </button>
      <dialog
        ref={dialogRef}
        className="reminder-dialog"
        aria-labelledby={titleId}
      >
        <div className="reminder-dialog__panel">
          <h2 id={titleId} className="reminder-dialog__title">
            読書リマインド（通知）
          </h2>
          <p className="reminder-dialog__note">
            ブラウザの通知 API を使います。アプリを閉じていても OS／ブラウザの制限により届かない場合があります（特に
            iOS Safari など）。
          </p>
          <p className="reminder-dialog__permission">
            通知の権限: <strong>{permissionLabel(permState)}</strong>
          </p>
          {permState !== 'granted' ? (
            <p className="reminder-dialog__actions">
              <button
                type="button"
                className="button button--primary"
                onClick={() => void requestNotifyPermission()}
              >
                通知を許可する
              </button>
            </p>
          ) : null}
          <label className="reminder-dialog__check">
            <input
              type="checkbox"
              checked={settings.enabled}
              disabled={permState !== 'granted'}
              onChange={(e) => {
                const on = e.target.checked
                setSettings((s) => ({ ...s, enabled: on && permState === 'granted' }))
              }}
            />
            毎日この時刻に通知する
          </label>
          <p className="reminder-dialog__time-row">
            <label className="reminder-dialog__time-label" htmlFor="reading-reminder-time">
              時刻
            </label>
            <input
              id="reading-reminder-time"
              type="time"
              className="reminder-dialog__time-input"
              value={timeStr}
              onChange={(e) => {
                const v = e.target.value
                setTimeStr(v)
                applyTimeStr(v)
              }}
            />
          </p>
          <div className="reminder-dialog__footer">
            <button
              type="button"
              className="button button--ghost"
              onClick={() => setDialogOpen(false)}
            >
              閉じる
            </button>
          </div>
        </div>
      </dialog>
    </>
  )
}
