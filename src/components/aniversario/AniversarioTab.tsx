import { useMemo } from 'react';
import { Obreiro } from '../../types';
import { CARGO_COLOR, CARGO_BG, MESES_LABELS } from '../../config/constants';

interface Props {
  obreiros: Obreiro[];
  mes: number;
}

export default function AniversarioTab({ obreiros, mes }: Props) {
  const aniversariantes = useMemo(() => {
    return obreiros
      .filter(o => !o.excluido && o.nasc)
      .filter(o => {
        const parts = o.nasc.split('/');
        return parseInt(parts[1], 10) === mes;
      })
      .sort((a, b) => {
        const dA = parseInt(a.nasc.split('/')[0], 10);
        const dB = parseInt(b.nasc.split('/')[0], 10);
        return dA - dB;
      });
  }, [obreiros, mes]);

  return (
    <div style={{ padding: '0 20px', animation: 'fadeIn .3s ease' }}>
      <h2 style={{ color: '#f0b84a', marginBottom: 15, fontSize: 18 }}>
        🎂 Aniversariantes — {MESES_LABELS[mes - 1]}
      </h2>

      {aniversariantes.length === 0 ? (
        <p style={{ color: '#64748b', textAlign: 'center', padding: 40 }}>
          Nenhum aniversariante neste mês.
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {aniversariantes.map(o => (
            <div key={o.id} style={{
              background: 'rgba(255,255,255,.04)',
              border: '1px solid rgba(255,255,255,.08)',
              borderRadius: 14,
              padding: '15px 20px',
              display: 'flex',
              alignItems: 'center',
              gap: 15,
            }}>
              <span style={{ fontSize: 28 }}>🎂</span>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <span style={{
                    ...({} as React.CSSProperties),
                    background: CARGO_BG[o.cargo],
                    color: CARGO_COLOR[o.cargo],
                    border: `1px solid ${CARGO_COLOR[o.cargo]}33`,
                    borderRadius: 6,
                    padding: '2px 8px',
                    fontSize: 10,
                    fontWeight: 800,
                  }}>{o.cargo}</span>
                  <span style={{ fontWeight: 700, fontSize: 15 }}>{o.name}</span>
                </div>
                <p style={{ fontSize: 13, color: '#94a3b8' }}>
                  📅 {o.nasc} · 📞 {o.tel}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
