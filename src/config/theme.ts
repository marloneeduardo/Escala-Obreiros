import { CSSProperties } from 'react';

export const B = {
  card: {
    background: 'rgba(255,255,255,.04)',
    border: '1px solid rgba(255,255,255,.08)',
    borderRadius: 16,
    padding: 20,
  } as CSSProperties,

  cardInner: {
    background: 'rgba(255,255,255,.03)',
    borderRadius: 12,
    padding: 15,
  } as CSSProperties,

  inp: {
    background: 'rgba(255,255,255,.06)',
    border: '1px solid rgba(255,255,255,.12)',
    borderRadius: 10,
    color: '#f1f5f9',
    padding: '10px 14px',
    fontSize: 14,
    width: '100%',
  } as CSSProperties,

  select: {
    background: 'rgba(255,255,255,.06)',
    border: '1px solid rgba(255,255,255,.12)',
    borderRadius: 10,
    color: '#f1f5f9',
    padding: '10px 14px',
    fontSize: 14,
    cursor: 'pointer',
  } as CSSProperties,

  btn: {
    background: 'linear-gradient(135deg, #4f46e5, #6366f1)',
    color: '#fff',
    border: 'none',
    borderRadius: 10,
    padding: '10px 20px',
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
  } as CSSProperties,

  btnDanger: {
    background: 'linear-gradient(135deg, #dc2626, #ef4444)',
    color: '#fff',
    border: 'none',
    borderRadius: 10,
    padding: '10px 20px',
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
  } as CSSProperties,

  btnGold: {
    background: 'linear-gradient(135deg, #d97706, #f59e0b)',
    color: '#fff',
    border: 'none',
    borderRadius: 10,
    padding: '10px 20px',
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
  } as CSSProperties,

  btnOutline: {
    background: 'transparent',
    color: '#94a3b8',
    border: '1px solid rgba(255,255,255,.12)',
    borderRadius: 10,
    padding: '10px 20px',
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
  } as CSSProperties,

  tab: (active: boolean) => ({
    background: active ? 'rgba(99,102,241,.2)' : 'transparent',
    color: active ? '#818cf8' : '#94a3b8',
    border: active ? '1px solid rgba(99,102,241,.3)' : '1px solid transparent',
    borderRadius: 10,
    padding: '8px 16px',
    fontSize: 13,
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all .15s ease',
    whiteSpace: 'nowrap' as const,
  }) as CSSProperties,

  badge: (color: string, bg: string) => ({
    background: bg,
    color,
    border: `1px solid ${color}33`,
    borderRadius: 8,
    padding: '4px 10px',
    fontSize: 11,
    fontWeight: 700,
  }) as CSSProperties,

  overlay: {
    position: 'fixed' as const,
    inset: 0,
    background: 'rgba(0,0,0,.6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    backdropFilter: 'blur(4px)',
  } as CSSProperties,

  modal: {
    background: '#1e2336',
    borderRadius: 20,
    padding: 30,
    maxWidth: 500,
    width: '90%',
    maxHeight: '80vh',
    overflow: 'auto',
    border: '1px solid rgba(255,255,255,.1)',
  } as CSSProperties,
};
