'use client';

import { useEffect, useRef } from 'react';
import { X, AlertTriangle } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'primary' | 'danger';
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({
  isOpen, title, message, confirmLabel = 'Confirm', cancelLabel = 'Cancel',
  variant = 'primary', onConfirm, onCancel,
}: ConfirmModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => { if (e.target === overlayRef.current) onCancel(); }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      {/* Modal */}
      <div className="glass-card-static relative z-10 w-full max-w-md overflow-hidden animate-fade-up">
        {/* Top accent line */}
        <div className={`h-px ${variant === 'danger' ? 'bg-gradient-to-r from-transparent via-red-500/50 to-transparent' : 'bg-gradient-to-r from-transparent via-primary-vivid/40 to-transparent'}`} />

        <div className="p-7">
          {/* Icon */}
          {variant === 'danger' && (
            <div className="w-11 h-11 rounded-2xl bg-red-500/10 border border-red-500/15 flex items-center justify-center mb-5">
              <AlertTriangle size={20} className="text-red-400" />
            </div>
          )}

          {/* Close button */}
          <button
            onClick={onCancel}
            className="absolute top-4 right-4 p-2 rounded-xl text-[#52525b] hover:text-on-surface hover:bg-[rgba(255,255,255,0.06)] transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>

          <h3 className="text-lg font-display font-semibold text-on-surface mb-2">{title}</h3>
          <p className="text-[#a1a1aa] text-sm mb-8 leading-relaxed">{message}</p>

          <div className="flex gap-3 justify-end">
            <button onClick={onCancel} className="btn-secondary text-sm px-5 py-2.5">
              {cancelLabel}
            </button>
            <button
              onClick={onConfirm}
              className={variant === 'danger' ? 'btn-danger text-sm px-5 py-2.5' : 'btn-primary text-sm px-5 py-2.5'}
            >
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
