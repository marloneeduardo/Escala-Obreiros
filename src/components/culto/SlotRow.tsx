import { Obreiro } from '../../types';
import { SlotMeta } from '../../types';
import PersonTag from '../shared/PersonTag';

interface Props {
  meta: SlotMeta;
  names: string[];
  obreiros: Obreiro[];
  isAdmin: boolean;
  onOverride?: (slotKey: string, index: number) => void;
}

export default function SlotRow({ meta, names, obreiros, isAdmin, onOverride }: Props) {
  return (
    <div style={{
      background: 'rgba(255,255,255,.03)',
      padding: 15,
      borderRadius: 12,
      borderLeft: `3px solid ${meta.color}`,
    }}>
      <div style={{
        color: meta.color,
        fontWeight: 800,
        fontSize: 12,
        marginBottom: 8,
        display: 'flex',
        alignItems: 'center',
        gap: 6,
      }}>
        {meta.icon} {meta.label}
        <span style={{
          fontSize: 10,
          opacity: 0.5,
          fontWeight: 400,
        }}>({names.length})</span>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {names.length > 0 ? (
          names.map((n, i) => (
            <PersonTag
              key={`${n}-${i}`}
              name={n}
              obreiros={obreiros}
              color={meta.color}
              onClick={isAdmin && onOverride ? () => onOverride(meta.key, i) : undefined}
            />
          ))
        ) : (
          <span style={{ fontSize: 12, color: '#64748b', fontStyle: 'italic' }}>—</span>
        )}
      </div>
    </div>
  );
}
