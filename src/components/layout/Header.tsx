import { MESES_LABELS } from '../../config/constants';

interface Props {
  isAdmin: boolean;
  onToggleAdmin: () => void;
  mes: number;
  ano: number;
  totalCultos: number;
  totalAtivos: number;
  totalEscalados: number;
  onPrint?: () => void;
}

export default function Header({
  isAdmin, onToggleAdmin, mes, ano,
  totalCultos, totalAtivos, totalEscalados, onPrint,
}: Props) {
  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      background: 'linear-gradient(180deg, #0d1021 0%, #0d1021 80%, transparent 100%)',
      paddingBottom: 20,
    }}>
      <div style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '20px 20px 0',
      }}>
        {/* Botões topo direita */}
        <div style={{ position: 'absolute', top: 10, right: 10, display: 'flex', gap: 8 }}>
          {isAdmin && onPrint && (
            <button
              onClick={onPrint}
              style={{
                background: 'rgba(255,255,255,.06)',
                color: '#94a3b8',
                border: '1px solid rgba(255,255,255,.1)',
                borderRadius: 8,
                padding: '6px 14px',
                fontSize: 14,
                cursor: 'pointer',
              }}
            >
              🖨️
            </button>
          )}
          <button
            onClick={onToggleAdmin}
            style={{
              background: isAdmin ? 'rgba(239,68,68,.2)' : 'rgba(255,255,255,.06)',
              color: isAdmin ? '#f87171' : '#94a3b8',
              border: `1px solid ${isAdmin ? 'rgba(239,68,68,.3)' : 'rgba(255,255,255,.1)'}`,
              borderRadius: 8,
              padding: '6px 14px',
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            {isAdmin ? '🔒 Sair' : 'Admin'}
          </button>
        </div>

        <div style={{ position: 'absolute', top: 0, left: '20%', right: '20%', height: 1, gap:8, marginTop: 20, background: 'linear-gradient(90deg, transparent, rgba(240, 184, 74, 0.8), transparent)' }}></div>

        {/* Logo */}
        <div style={{
          position: 'relative',
          marginTop: 20,
          marginBottom: 20,
        }}>
          {/* Glow atrás do logo */}
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 200,
            height: 200,
            background: 'radial-gradient(circle, rgba(240,184,74,.15) 0%, transparent 70%)',
            borderRadius: '50%',
            pointerEvents: 'none',
          }} />
          <img
            src="/logo.png"
            alt="Assembleia de Deus - Ministério de Madureira"
            style={{
              position: 'relative',
              height: 90,
              objectFit: 'contain',
              filter: 'brightness(1.1)',
            }}
          />
        </div>

        {/* Linha dourada + ponto */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <div style={{ width: 50, height: 1, background: 'linear-gradient(90deg, transparent, #f0b84a)' }} />
          <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#f0b84a' }} />
          <div style={{ width: 50, height: 1, background: 'linear-gradient(90deg, #f0b84a, transparent)' }} />
        </div>

        {/* Título */}
        <p style={{
          fontFamily: '"Cinzel", serif',
          fontSize: 10,
          letterSpacing: 4,
          color: '#94a3b8',
          textTransform: 'uppercase',
          marginBottom: 6,
        }}>
          Corpo de Obreiros ADJIPA-SEDE
        </p>

        <h1 style={{
          fontFamily: '"Cinzel", serif',
          fontSize: 26,
          color: '#f0b84a',
          textShadow: '0 0 30px rgba(240,184,74,.3)',
          margin: 0,
          letterSpacing: 8,
        }}>
          E S C A L A
        </h1>

        {/* Linha dourada + ponto */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 12 }}>
          <div style={{ width: 50, height: 1, background: 'linear-gradient(90deg, transparent, #f0b84a)' }} />
          <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#f0b84a' }} />
          <div style={{ width: 50, height: 1, background: 'linear-gradient(90deg, #f0b84a, transparent)' }} />
        </div>

        {/* KPIs */}
        <p style={{
          fontSize: 13,
          color: '#64748b',
          marginTop: 14,
          textAlign: 'center',
          marginBottom: 20,
        }}>
          {MESES_LABELS[mes - 1]} {ano} · {totalCultos} cultos ·{' '}
          <span style={{ color: '#fbbf24' }}>{totalAtivos} ativos</span> ·{' '}
          <span style={{ color: '#34d399' }}>{totalEscalados} escalados</span>
        </p>
      </div>
    </header>
  );
}
