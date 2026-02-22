import { Toast } from '../../types';

const TOAST_COLORS: Record<string, { bg: string; border: string; color: string }> = {
  success: { bg: 'rgba(16,185,129,.15)', border: '#10b981', color: '#34d399' },
  warning: { bg: 'rgba(245,158,11,.15)', border: '#f59e0b', color: '#fbbf24' },
  error:   { bg: 'rgba(239,68,68,.15)',  border: '#ef4444', color: '#f87171' },
  info:    { bg: 'rgba(99,102,241,.15)', border: '#6366f1', color: '#818cf8' },
};

interface Props {
  toasts: Toast[];
  onRemove: (id: number) => void;
}

export default function ToastContainer({ toasts, onRemove }: Props) {
  if (toasts.length === 0) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 20,
      right: 20,
      zIndex: 2000,
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
    }}>
      {toasts.map(toast => {
        const style = TOAST_COLORS[toast.type] || TOAST_COLORS.info;
        return (
          <div
            key={toast.id}
            onClick={() => onRemove(toast.id)}
            style={{
              background: style.bg,
              border: `1px solid ${style.border}40`,
              color: style.color,
              borderRadius: 10,
              padding: '10px 16px',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
              animation: 'slideIn .3s ease',
              maxWidth: 350,
              backdropFilter: 'blur(10px)',
            }}
          >
            {toast.message}
          </div>
        );
      })}
    </div>
  );
}
