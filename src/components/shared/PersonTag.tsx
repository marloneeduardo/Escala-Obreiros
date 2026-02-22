import { Obreiro } from '../../types';
import { CARGO_COLOR, CARGO_BG } from '../../config/constants';

interface Props {
  name: string;
  obreiros: Obreiro[];
  color?: string;
  onClick?: () => void;
  dimmed?: boolean;
}

export default function PersonTag({ name, obreiros, color, onClick, dimmed }: Props) {
  const o = obreiros.find(x => x.name === name);
  const cc = CARGO_COLOR[o?.cargo || 'CP'] || color || '#818cf8';
  const bg = CARGO_BG[o?.cargo || 'CP'] || 'rgba(255,255,255,.05)';

  return (
    <span
      onClick={onClick}
      style={{
        background: bg,
        color: cc,
        border: `1px solid ${cc}33`,
        borderRadius: 8,
        padding: '5px 10px',
        fontSize: 12,
        fontWeight: 600,
        cursor: onClick ? 'pointer' : 'default',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        opacity: dimmed ? 0.5 : 1,
        transition: 'all .15s ease',
      }}
    >
      <span style={{
        background: cc,
        color: '#fff',
        borderRadius: 4,
        padding: '1px 5px',
        fontSize: 9,
        fontWeight: 800,
      }}>
        {o?.cargo || '??'}
      </span>
      {name.split(' ').slice(0, 2).join(' ')}
    </span>
  );
}
