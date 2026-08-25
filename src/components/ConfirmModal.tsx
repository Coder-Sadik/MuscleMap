'use client'

import { AlertTriangle, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

type ConfirmModalProps = {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  description?: string
  confirmText?: string
  cancelText?: string
  variant?: 'danger' | 'warning' | 'primary'
  icon?: 'trash' | 'alert'
}

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
  icon = 'trash',
}: ConfirmModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      {/* Backdrop */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal Card */}
      <div 
        className="relative z-10 w-full max-w-sm bg-zinc-950 border border-white/10 rounded-3xl p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200 text-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glowing Icon */}
        <div className="flex justify-center">
          {variant === 'danger' ? (
            <div className="p-4 rounded-2xl bg-rose-500/10 text-rose-400 border border-rose-500/20 shadow-[0_0_30px_-5px_rgba(244,63,94,0.3)]">
              {icon === 'trash' ? <Trash2 className="w-7 h-7" /> : <AlertTriangle className="w-7 h-7" />}
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 shadow-[0_0_30px_-5px_rgba(245,158,11,0.3)]">
              <AlertTriangle className="w-7 h-7" />
            </div>
          )}
        </div>

        {/* Text Content */}
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-white tracking-tight">{title}</h3>
          {description && (
            <p className="text-sm text-zinc-400 leading-relaxed font-medium">
              {description}
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            className="h-12 rounded-2xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-semibold border border-white/5 transition-all cursor-pointer"
          >
            {cancelText}
          </Button>

          <Button
            type="button"
            onClick={() => {
              onConfirm()
              onClose()
            }}
            className={`h-12 rounded-2xl font-bold text-white transition-all cursor-pointer ${
              variant === 'danger'
                ? 'bg-rose-600 hover:bg-rose-500 shadow-[0_0_25px_-5px_rgba(244,63,94,0.5)] active:scale-95'
                : 'bg-emerald-600 hover:bg-emerald-500 shadow-[0_0_25px_-5px_rgba(16,185,129,0.5)] active:scale-95'
            }`}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  )
}
