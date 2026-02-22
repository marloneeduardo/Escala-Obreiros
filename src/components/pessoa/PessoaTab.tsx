import { useState, useMemo } from 'react';
import { ScheduleEntry, Obreiro } from '../../types';
import { FM, CARGO_COLOR, CARGO_BG } from '../../config/constants';
import { B } from '../../config/theme';

interface Props {
  schedule: ScheduleEntry[];
  obreiros: Obreiro[];
}

export default function PessoaTab({ schedule, obreiros }: Props) {
  const [search, setSearch] = useState('');

  const activeObreiros = useMemo(
    () => obreiros.filter(o => !o.excluido).sort((a, b) => a.name.localeCompare(b.name)),
    [obreiros]
  );

  const filtered = useMemo(
    () => search
      ? activeObreiros.filter(o => o.name.toLowerCase().includes(search.toLowerCase()))
      : [],
    [activeObreiros, search]
  );

  const selectedObreiro = filtered.length === 1 ? filtered[0] : activeObreiros.find(o => o.name === search);

  const escalas = useMemo(() => {
    if (!selectedObreiro) return [];
    return schedule
      .map(entry => {
        const funcoes: string[] = [];
        for (const m of FM) {
          const val = entry.slots[m.key as keyof typeof entry.slots];
          const names = Array.isArray(val) ? val : val ? [val] : [];
          if (names.includes(selectedObreiro.name)) {
            funcoes.push(m.label);
          }
        }
        return funcoes.length > 0 ? { culto: entry.culto, funcoes } : null;
      })
      .filter(Boolean) as { culto: ScheduleEntry['culto']; funcoes: string[] }[];
  }, [selectedObreiro, schedule]);

  return (
    <div style={{ padding: '0 20px', animation: 'fadeIn .3s ease' }}>
      <h2 style={{ color: '#f0b84a', marginBottom: 15, fontSize: 18 }}>👤 Escala por Pessoa</h2>

      <input
        type="text"
        placeholder="Buscar obreiro pelo nome..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={{ ...B.inp, marginBottom: 15 }}
        list="obreiros-list"
      />
      <datalist id="obreiros-list">
        {activeObreiros.map(o => (
          <option key={o.id} value={o.name} />
        ))}
      </datalist>

      {/* Lista de resultados para seleção */}
      {search && !selectedObreiro && filtered.length > 0 && (
        <div style={{
          background: 'rgba(255,255,255,.04)',
          borderRadius: 10,
          border: '1px solid rgba(255,255,255,.08)',
          marginBottom: 15,
          maxHeight: 200,
          overflow: 'auto',
        }}>
          {filtered.slice(0, 10).map(o => (
            <button
              key={o.id}
              onClick={() => setSearch(o.name)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                width: '100%',
                padding: '10px 15px',
                background: 'transparent',
                border: 'none',
                borderBottom: '1px solid rgba(255,255,255,.05)',
                color: '#f1f5f9',
                cursor: 'pointer',
                fontSize: 14,
                textAlign: 'left',
              }}
            >
              <span style={{
                background: CARGO_COLOR[o.cargo],
                color: '#fff',
                borderRadius: 4,
                padding: '2px 6px',
                fontSize: 10,
                fontWeight: 800,
              }}>{o.cargo}</span>
              {o.name}
            </button>
          ))}
        </div>
      )}

      {/* Detalhes do obreiro selecionado */}
      {selectedObreiro && (
        <div>
          <div style={{
            ...B.card,
            marginBottom: 15,
            display: 'flex',
            alignItems: 'center',
            gap: 15,
          }}>
            <span style={{
              background: CARGO_BG[selectedObreiro.cargo],
              color: CARGO_COLOR[selectedObreiro.cargo],
              border: `1px solid ${CARGO_COLOR[selectedObreiro.cargo]}33`,
              borderRadius: 10,
              padding: '8px 14px',
              fontSize: 14,
              fontWeight: 800,
            }}>{selectedObreiro.cargo}</span>
            <div>
              <p style={{ fontSize: 16, fontWeight: 700 }}>{selectedObreiro.name}</p>
              <p style={{ fontSize: 12, color: '#94a3b8' }}>
                {selectedObreiro.tel} · {selectedObreiro.nasc}
              </p>
            </div>
            <span style={{
              marginLeft: 'auto',
              background: 'rgba(99,102,241,.15)',
              color: '#818cf8',
              borderRadius: 8,
              padding: '4px 10px',
              fontSize: 13,
              fontWeight: 700,
            }}>{escalas.length} culto{escalas.length !== 1 ? 's' : ''}</span>
          </div>

          {escalas.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {escalas.map(({ culto, funcoes }) => (
                <div key={culto.id} style={{
                  background: 'rgba(255,255,255,.04)',
                  borderRadius: 10,
                  padding: '12px 15px',
                  border: '1px solid rgba(255,255,255,.06)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                  <div>
                    <span style={{ fontWeight: 700, fontSize: 14 }}>{culto.weekday}</span>
                    <span style={{ color: '#94a3b8', marginLeft: 8, fontSize: 13 }}>{culto.date}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {funcoes.map(f => (
                      <span key={f} style={{
                        background: 'rgba(99,102,241,.15)',
                        color: '#818cf8',
                        borderRadius: 6,
                        padding: '3px 8px',
                        fontSize: 11,
                        fontWeight: 600,
                      }}>{f}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: '#64748b', textAlign: 'center', padding: 20 }}>
              Este obreiro não está escalado neste mês.
            </p>
          )}
        </div>
      )}

      {!search && (
        <p style={{ color: '#64748b', textAlign: 'center', padding: 40 }}>
          Digite o nome de um obreiro para ver sua escala.
        </p>
      )}
    </div>
  );
}
