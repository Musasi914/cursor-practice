import { useEffect, useRef } from 'react'

type ConfirmDialogProps = {
  open: boolean
  title: string
  message: string
  confirmLabel: string
  cancelLabel: string
  onConfirm: () => void
  onCancel: () => void
  /** 危険操作の主ボタンを強調する場合 */
  variant?: 'danger' | 'default'
}

export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel,
  variant = 'default',
}: ConfirmDialogProps) {
  const ref = useRef<HTMLDialogElement>(null)
  const confirmedRef = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) {
      return
    }
    const onClose = () => {
      if (confirmedRef.current) {
        confirmedRef.current = false
        return
      }
      onCancel()
    }
    el.addEventListener('close', onClose)
    return () => el.removeEventListener('close', onClose)
  }, [onCancel])

  useEffect(() => {
    const el = ref.current
    if (!el) {
      return
    }
    if (open && !el.open) {
      el.showModal()
      return
    }
    if (!open && el.open) {
      el.close()
    }
  }, [open])

  const closeDialog = () => {
    ref.current?.close()
  }

  const handleConfirm = () => {
    confirmedRef.current = true
    onConfirm()
    closeDialog()
  }

  return (
    <dialog ref={ref} className="confirm-dialog" aria-labelledby="confirm-dialog-title">
      <div className="confirm-dialog__panel" role="document">
        <h2 id="confirm-dialog-title" className="confirm-dialog__title">
          {title}
        </h2>
        <p className="confirm-dialog__message">{message}</p>
        <div className="confirm-dialog__actions">
          <button type="button" className="button button--ghost" onClick={closeDialog}>
            {cancelLabel}
          </button>
          <button
            type="button"
            className={
              variant === 'danger' ? 'button button--danger' : 'button button--primary'
            }
            onClick={handleConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </dialog>
  )
}
