import { useState, useMemo } from 'react';
import { Obreiro, ScheduleSlots } from '../../types';
import { B } from '../../config/theme';
import { CARGO_COLOR } from '../../config/constants';

interface Props {
  slotKey: string;
  slotIndex: number;
  currentName: string;
  allSlots: ScheduleSlots;
  obreiros: Obreiro[];
  onSelect: (name: string | null) => void;
  onClose: () => void;
}

export default function OverrideModal({ slotKey, currentName, allSlots, obreiros, onSelect, onClose }: Props) {
  const [search, setSearch] = useState('');

  // Obreiros já escalados neste culto
  const usedNames = useMemo(() => {
    const names: string[] = [];
    Object.values(allSlots).forEach(val => {
      if (Array.isArray(val)) names.push(...val);
      else if (val) names.push(val as string);
    });
    return names;
  }, [allSlots]);

  const filtered = useMemo(() => {
    return obreiros
      .filter(o => !o.excluido)
      .filter(o => o.name.toLowerCase().includes(search.toLowerCase()))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [obreiros, search]);

  return (
    <div style={B.overlay} onClick={onClose}>
      <div style={{ ...B.modal, maxHeight: '70vh' }} onClick={e => e.stopPropagation()}>
        <h3 style={{ marginBottom: 15, color: '#f0b84a' }}>
          Substituir: {currentName?.split(' ').slice(0, 2).join(' ') || 'vazio'}
        </h3>

        <input
          type="text"
          placeholder="Buscar obreiro..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ ...B.inp, marginBottom: 15 }}
          autoFocus
        />

        <div style={{ maxHeight: 300, overflow: 'auto', display: 'flex', flexDirection: 'column', gap: 4 }}>
          {/* Opção: remover */}
          <button
            onClick={() => onSelect(null)}
            style={{
              ...B.btnOutline,
              textAlign: 'left',
              padding: '8px 12px',
              fontSize: 13,
              color: '#f87171',
            }}
          >
            ✕ Remover
          </button>

          {filtered.map(o => {
            const isUsed = usedNames.includes(o.name) && o.name !== currentName;
            return (
              <button
                key={o.id}
                onClick={() => !isUsed && onSelect(o.name)}
                style={{
                  background: o.name === currentName ? 'rgba(99,102,241,.2)' : 'rgba(255,255,255,.04)',
                  color: isUsed ? '#64748b' : '#f1f5f9',
                  border: '1px solid rgba(255,255,255,.08)',
                  borderRadius: 8,
                  padding: '8px 12px',
                  cursor: isUsed ? 'not-allowed' : 'pointer',
                  textAlign: 'left',
                  fontSize: 13,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  opacity: isUsed ? 0.4 : 1,
                }}
              >
                <span style={{
                  background: CARGO_COLOR[o.cargo],
                  color: '#fff',
                  borderRadius: 4,
                  padding: '1px 5px',
                  fontSize: 9,
                  fontWeight: 800,
                }}>{o.cargo}</span>
                {o.name}
                {isUsed && <span style={{ fontSize: 10, marginLeft: 'auto' }}>já escalado</span>}
              </button>
            );
          })}
        </div>

        <div style={{ marginTop: 15, textAlign: 'right' }}>
          <button style={B.btnOutline} onClick={onClose}>Cancelar</button>
        </div>
      </div>
    </div>
  );
}
