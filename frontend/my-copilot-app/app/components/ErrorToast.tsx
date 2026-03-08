'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { WifiOff, Wifi, X, AlertCircle } from 'lucide-react';

type ToastType = 'offline' | 'online' | 'error';

interface ErrorToastProps {
  message: string;
  type: ToastType;
  onDismiss?: () => void;
}

const STYLES: Record<ToastType, { bg: string; border: string; color: string }> = {
  offline: { bg: '#1c1c1e', border: '#3a3a3c', color: '#ffffff' },
  online:  { bg: '#f0fdf4', border: '#86efac', color: '#166534' },
  error:   { bg: '#fef2f2', border: '#fca5a5', color: '#991b1b' },
};

const ICONS: Record<ToastType, React.ReactNode> = {
  offline: <WifiOff size={14} />,
  online:  <Wifi size={14} />,
  error:   <AlertCircle size={14} />,
};

export function ErrorToast({ message, type, onDismiss }: ErrorToastProps) {
  const s = STYLES[type];
  return (
    <motion.div
      initial={{ y: -48, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -48, opacity: 0 }}
      transition={{ duration: 0.22, ease: 'easeOut' }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        padding: '9px 16px',
        background: s.bg,
        borderBottom: `1px solid ${s.border}`,
        color: s.color,
        fontSize: 13,
        fontWeight: 500,
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      {ICONS[type]}
      <span>{message}</span>
      {onDismiss && (
        <button
          onClick={onDismiss}
          style={{
            marginLeft: 8,
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            color: s.color,
            display: 'flex',
            alignItems: 'center',
            padding: 2,
            opacity: 0.7,
          }}
        >
          <X size={13} />
        </button>
      )}
    </motion.div>
  );
}

interface NetworkToastProps {
  isOnline: boolean;
  backOnlineVisible: boolean;
  onDismissBackOnline: () => void;
}

export function NetworkToast({ isOnline, backOnlineVisible, onDismissBackOnline }: NetworkToastProps) {
  return (
    <AnimatePresence>
      {!isOnline && (
        <ErrorToast
          key="offline"
          type="offline"
          message="You're offline — changes won't be saved"
        />
      )}
      {isOnline && backOnlineVisible && (
        <ErrorToast
          key="online"
          type="online"
          message="Back online"
          onDismiss={onDismissBackOnline}
        />
      )}
    </AnimatePresence>
  );
}
