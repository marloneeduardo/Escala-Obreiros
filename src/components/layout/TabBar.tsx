import { B } from '../../config/theme';

interface Tab {
  key: string;
  label: string;
  adminOnly?: boolean;
}

const TABS: Tab[] = [
  { key: 'culto',        label: '⛪ Culto' },
  { key: 'ebd',          label: '📖 EBD' },
  { key: 'obreiros',     label: '👥 Cadastros',      adminOnly: true },
  { key: 'aniversario',  label: '🎂 Aniversários',   adminOnly: true },
  { key: 'resumo',       label: '📊 Resumo',         adminOnly: true },
  { key: 'config',       label: '⚙️ Config',         adminOnly: true },
];

interface Props {
  activeTab: string;
  isAdmin: boolean;
  onTabChange: (tab: string) => void;
}

export default function TabBar({ activeTab, isAdmin, onTabChange }: Props) {
  const visibleTabs = TABS.filter(t => !t.adminOnly || isAdmin);

  return (
    <div style={{
      display: 'flex',
      gap: 6,
      padding: '0 20px',
      marginBottom: 20,
      overflowX: 'auto',
      WebkitOverflowScrolling: 'touch',
    }}>
      {visibleTabs.map(tab => (
        <button
          key={tab.key}
          onClick={() => onTabChange(tab.key)}
          style={B.tab(activeTab === tab.key)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
