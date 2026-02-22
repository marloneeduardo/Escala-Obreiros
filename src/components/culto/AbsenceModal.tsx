import { useState } from 'react';
import { Obreiro, Absences } from '../../types';
import { B } from '../../config/theme';
import { getLast4Digits } from '../../lib/masks';

interface Props {
  date: string;
  obreiros: Obreiro[];
  absences: Absences;
  onSave: (absences: Absences) => void;
  onClose: () => void;
  addToast: (type: 'success' | 'error' | 'warning' | 'info', msg: string) => void;
}

export default function AbsenceModal({ date, obreiros, absences, onSave, onClose, addToast }: Props) {
  const [selectedName, setSelectedName] = useState('');
  const [last4, setLast4] = useState('');
  const [justificativa, setJustificativa] = useState('');
  const [error, setError] = useState('');

  const existing = absences[date] || {};

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!selectedName) { setError('Selecione um obreiro'); return; }
    if (!justificativa.trim()) { setError('Digite a justificativa'); return; }

    const worker = obreiros.find(o => o.name === selectedName);
    if (!worker?.tel) { setError('Obreiro sem telefone cadastrado'); return; }

    if (getLast4Digits(worker.tel) !== last4) {
      setError('Últimos 4 dígitos do telefone incorretos');
      return;
    }

    const updated: Absences = {
      ...absences,
      [date]: {
        ...existing,
        [selectedName]: {
          justificativa: justificativa.trim(),
          registeredAt: new Date().toISOString(),
        },
      },
    };

    onSave(updated);
    addToast('success', `Justificativa registrada para ${selectedName.split(' ').slice(0, 2).join(' ')}`);
    onClose();
  };

  const activeObreiros = obreiros.filter(o => !o.excluido).sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div style={B.overlay} onClick={onClose}>
      <div style={B.modal} onClick={e => e.stopPropagation()}>
        <h3 style={{ marginBottom: 5, color: '#f59e0b' }}>Registrar Justificativa de Falta</h3>
        <p style={{ fontSize: 13, color: '#94a3b8', marginBottom: 20 }}>Culto: {date}</p>

        {/* Justificativas existentes */}
        {Object.keys(existing).length > 0 && (
          <div style={{ marginBottom: 20, padding: 12, background: 'rgba(255,255,255,.03)', borderRadius: 10 }}>
            <p style={{ fontSize: 12, color: '#64748b', marginBottom: 8 }}>Já registradas:</p>
            {Object.entries(existing).map(([name, rec]) => (
              <div key={name} style={{ fontSize: 13, marginBottom: 4 }}>
                <strong style={{ color: '#f0b84a' }}>{name.split(' ').slice(0, 2).join(' ')}</strong>
                <span style={{ color: '#94a3b8' }}> — {rec.justificativa}</span>
              </div>
            ))}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <select
            value={selectedName}
            onChange={e => setSelectedName(e.target.value)}
            style={B.select}
          >
            <option value="">Selecione o obreiro...</option>
            {activeObreiros.map(o => (
              <option key={o.id} value={o.name}>{o.name}</option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Últimos 4 dígitos do telefone"
            value={last4}
            onChange={e => setLast4(e.target.value.replace(/\D/g, '').slice(0, 4))}
            maxLength={4}
            style={B.inp}
          />

          <textarea
            placeholder="Justificativa da falta..."
            value={justificativa}
            onChange={e => setJustificativa(e.target.value)}
            rows={3}
            style={{ ...B.inp, resize: 'vertical' }}
          />

          {error && <p style={{ color: '#f87171', fontSize: 13 }}>{error}</p>}

          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            <button type="button" style={B.btnOutline} onClick={onClose}>Cancelar</button>
            <button type="submit" style={B.btnGold}>Registrar</button>
          </div>
        </form>
      </div>
    </div>
  );
}
