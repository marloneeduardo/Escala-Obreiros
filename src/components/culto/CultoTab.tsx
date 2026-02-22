import { useState } from 'react';
import { ScheduleEntry, Obreiro, Overrides, Absences } from '../../types';
import { FM } from '../../config/constants';
import { dByType } from '../../config/constants';
import CultoCard from './CultoCard';
import SlotRow from './SlotRow';
import OverrideModal from './OverrideModal';
import AbsenceModal from './AbsenceModal';
import { printSchedule } from '../../lib/print';

interface Props {
  schedule: ScheduleEntry[];
  obreiros: Obreiro[];
  overrides: Overrides;
  absences: Absences;
  mes: number;
  ano: number;
  isAdmin: boolean;
  onSaveOverrides: (ov: Overrides) => void;
  onSaveAbsences: (ab: Absences) => void;
  addToast: (type: 'success' | 'error' | 'warning' | 'info', msg: string) => void;
}

export default function CultoTab({
  schedule, obreiros, overrides, absences,
  mes, ano, isAdmin, onSaveOverrides, onSaveAbsences, addToast,
}: Props) {
  const [selIdx, setSelIdx] = useState(0);
  const [overrideTarget, setOverrideTarget] = useState<{ slotKey: string; index: number } | null>(null);
  const [showAbsence, setShowAbsence] = useState(false);

  const sel = schedule[selIdx];
  if (!sel) return <p style={{ color: '#94a3b8', textAlign: 'center', padding: 40 }}>Nenhum culto configurado para este mês.</p>;

  const dw = dByType(sel.culto.type);

  const countEscalados = (entry: ScheduleEntry) => {
    let total = 0;
    Object.values(entry.slots).forEach(val => {
      if (Array.isArray(val)) total += val.length;
      else if (val) total += 1;
    });
    return total;
  };

  const handleOverride = (slotKey: string, index: number) => {
    setOverrideTarget({ slotKey, index });
  };

  const handleOverrideSelect = (name: string | null) => {
    if (!overrideTarget || !sel) return;
    const { slotKey, index } = overrideTarget;
    const date = sel.culto.date;
    const currentOv = { ...(overrides[date] || {}) };

    const currentSlot = sel.slots[slotKey as keyof typeof sel.slots];

    if (Array.isArray(currentSlot)) {
      const arr = [...currentSlot];
      if (name === null) {
        arr.splice(index, 1);
      } else {
        arr[index] = name;
      }
      currentOv[slotKey] = arr;
    } else {
      if (name === null) {
        delete currentOv[slotKey];
      } else {
        currentOv[slotKey] = name;
      }
    }

    const updatedOverrides = { ...overrides, [date]: currentOv };
    onSaveOverrides(updatedOverrides);
    setOverrideTarget(null);
    addToast('success', 'Override salvo');
  };

  const visibleSlots = FM.filter(m => {
    if (m.santaCeiaOnly && !sel.culto.santaCeia) return false;
    return true;
  });

  return (
    <div style={{ padding: '0 20px', animation: 'fadeIn .3s ease' }}>
      {/* Grid de cultos */}
      <div style={{
        display: 'flex',
        gap: 8,
        marginBottom: 20,
        overflowX: 'auto',
        paddingBottom: 8,
        WebkitOverflowScrolling: 'touch',
      }}>
        {schedule.map((entry, i) => (
          <CultoCard
            key={entry.culto.id}
            culto={entry.culto}
            totalEscalados={countEscalados(entry)}
            isSelected={selIdx === i}
            onClick={() => setSelIdx(i)}
          />
        ))}
      </div>

      {/* Navegação */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 15 }}>
        <button
          onClick={() => setSelIdx(Math.max(0, selIdx - 1))}
          disabled={selIdx === 0}
          style={{
            background: 'rgba(255,255,255,.06)',
            color: selIdx === 0 ? '#64748b' : '#f1f5f9',
            border: '1px solid rgba(255,255,255,.1)',
            borderRadius: 8,
            padding: '6px 12px',
            cursor: selIdx === 0 ? 'default' : 'pointer',
          }}
        >◂ Anterior</button>

        <h2 style={{ color: dw.accent, fontSize: 18, fontWeight: 700, margin: 0 }}>
          {sel.culto.weekday}, {sel.culto.date}
          {sel.culto.label && <span style={{ fontSize: 13, color: '#94a3b8', fontWeight: 400 }}> — {sel.culto.label}</span>}
        </h2>

        <button
          onClick={() => setSelIdx(Math.min(schedule.length - 1, selIdx + 1))}
          disabled={selIdx === schedule.length - 1}
          style={{
            background: 'rgba(255,255,255,.06)',
            color: selIdx === schedule.length - 1 ? '#64748b' : '#f1f5f9',
            border: '1px solid rgba(255,255,255,.1)',
            borderRadius: 8,
            padding: '6px 12px',
            cursor: selIdx === schedule.length - 1 ? 'default' : 'pointer',
          }}
        >Próximo ▸</button>
      </div>

      {/* Detalhe do culto */}
      <div style={{
        background: 'rgba(255,255,255,.04)',
        borderRadius: 20,
        padding: 20,
        border: '1px solid rgba(255,255,255,.08)',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
      }}>
        {visibleSlots.map(m => {
          const val = sel.slots[m.key as keyof typeof sel.slots];
          const names = Array.isArray(val) ? val : val ? [val] : [];
          return (
            <SlotRow
              key={m.key}
              meta={m}
              names={names.filter(Boolean) as string[]}
              obreiros={obreiros}
              isAdmin={isAdmin}
              onOverride={isAdmin ? handleOverride : undefined}
            />
          );
        })}
      </div>

      {/* Botões */}
      <div style={{ display: 'flex', gap: 10, marginTop: 20, flexWrap: 'wrap' }}>
        <button
          onClick={() => printSchedule(schedule, obreiros, mes, ano)}
          style={{
            background: 'linear-gradient(135deg, #4f46e5, #6366f1)',
            color: '#fff',
            border: 'none',
            borderRadius: 10,
            padding: '10px 20px',
            fontSize: 14,
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          🖨️ Imprimir Escala
        </button>

        <button
          onClick={() => setShowAbsence(true)}
          style={{
            background: 'linear-gradient(135deg, #d97706, #f59e0b)',
            color: '#fff',
            border: 'none',
            borderRadius: 10,
            padding: '10px 20px',
            fontSize: 14,
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          📝 Justificar Falta
        </button>
      </div>

      {/* Modais */}
      {overrideTarget && (
        <OverrideModal
          slotKey={overrideTarget.slotKey}
          slotIndex={overrideTarget.index}
          currentName={(() => {
            const val = sel.slots[overrideTarget.slotKey as keyof typeof sel.slots];
            if (Array.isArray(val)) return val[overrideTarget.index] || '';
            return (val as string) || '';
          })()}
          allSlots={sel.slots}
          obreiros={obreiros}
          onSelect={handleOverrideSelect}
          onClose={() => setOverrideTarget(null)}
        />
      )}

      {showAbsence && (
        <AbsenceModal
          date={sel.culto.date}
          obreiros={obreiros}
          absences={absences}
          onSave={onSaveAbsences}
          onClose={() => setShowAbsence(false)}
          addToast={addToast}
        />
      )}
    </div>
  );
}
