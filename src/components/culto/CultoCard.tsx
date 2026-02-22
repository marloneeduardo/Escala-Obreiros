import { Culto } from '../../types';
import { dByType } from '../../config/constants';

interface Props {
  culto: Culto;
  totalEscalados: number;
  isSelected: boolean;
  onClick: () => void;
}

export default function CultoCard({ culto, totalEscalados, isSelected, onClick }: Props) {
  const dw = dByType(culto.type);

  return (
    <button
      onClick={onClick}
      className="hover-card"
      style={{
        background: isSelected
          ? `linear-gradient(135deg, ${dw.pill}, ${dw.pill}cc)`
          : 'rgba(255,255,255,.04)',
        color: isSelected ? '#fff' : dw.accent,
        border: `1px solid ${isSelected ? dw.accent + '60' : 'rgba(255,255,255,.08)'}`,
        borderRadius: 12,
        padding: '12px 8px',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 4,
        minWidth: 70,
        transition: 'all .15s ease',
      }}
    >
      <span style={{ fontSize: 11, fontWeight: 700 }}>{culto.weekday}</span>
      <span style={{ fontSize: 15, fontWeight: 800 }}>{culto.date.slice(0, 5)}</span>
      {culto.santaCeia && <span style={{ fontSize: 10 }}>🍷</span>}
      {culto.label && <span style={{ fontSize: 9, opacity: 0.7, maxWidth: 60, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{culto.label}</span>}
      <span style={{
        fontSize: 10,
        background: 'rgba(255,255,255,.1)',
        borderRadius: 6,
        padding: '2px 6px',
        marginTop: 2,
      }}>{totalEscalados}</span>
    </button>
  );
}
