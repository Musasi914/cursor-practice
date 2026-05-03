import { useEffect, useRef } from 'react'

type UseReadingReminderOptions = {
  enabled: boolean
  hour: number
  minute: number
}

/**
 * 指定時刻に 1 回だけブラウザ通知を試みる（権限が granted のときのみ）。
 * 同一分の重複通知を避けるため、分単位のキーで抑止する。
 */
export function useReadingReminder({ enabled, hour, minute }: UseReadingReminderOptions) {
  const firedMinuteKeyRef = useRef<string | null>(null)

  useEffect(() => {
    if (!enabled || typeof Notification === 'undefined') {
      return
    }
    if (Notification.permission !== 'granted') {
      return
    }

    const tick = () => {
      const now = new Date()
      if (now.getHours() !== hour || now.getMinutes() !== minute) {
        return
      }
      const minuteKey = `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}-${hour}-${minute}`
      if (firedMinuteKeyRef.current === minuteKey) {
        return
      }
      firedMinuteKeyRef.current = minuteKey
      try {
        new Notification('読書の時間です', {
          body: '今日の読書を記録してみましょう。',
          lang: 'ja',
        })
      } catch {
        // 環境によっては Notification コンストラクタが失敗する
      }
    }

    const id = window.setInterval(tick, 15_000)
    tick()
    return () => window.clearInterval(id)
  }, [enabled, hour, minute])
}
