import { useState } from 'react';
import { Obreiro } from '../../types';
import { DF, EMPTY_FORM } from '../../config/constants';
import { B } from '../../config/theme';
import { maskDate, maskPhone, isValidDate, isValidPhone } from '../../lib/masks';

interface Props {
  obreiro?: Obreiro;
  obreiros: Obreiro[];
  onSave: (obreiro: Obreiro) => void;
  onDelete?: (obreiro: Obreiro) => void;
  onClose: () => void;
  addToast: (type: 'success' | 'error' | 'warning' | 'info', msg: string) => void;
}

export default function ObreiroForm({ obreiro, obreiros, onSave, onDelete, onClose, addToast }: Props) {
  const isEditing = !!obreiro;
  const [form, setForm] = useState<Omit<Obreiro, 'id'> & { id?: number }>(
    obreiro || { ...EMPTY_FORM }
  );
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const set = <K extends keyof typeof form>(key: K, value: typeof form[K]) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) { addToast('error', 'Nome é obrigatório'); return; }
    if (form.nasc && !isValidDate(form.nasc)) { addToast('error', 'Data de nascimento inválida'); return; }
    if (form.tel && !isValidPhone(form.tel)) { addToast('error', 'Telefone inválido'); return; }

    const id = form.id || Math.max(0, ...obreiros.map(o => o.id)) + 1;
    onSave({ ...DF, ...form, id } as Obreiro);
    const tipo = form.cargo === 'PROF' ? 'Professor' : 'Obreiro';
    addToast('success', isEditing ? `${tipo} atualizado` : `${tipo} adicionado`);
    onClose();
  };

  const FLAG_OPTIONS: { key: keyof Obreiro; label: string; emoji: string }[] = [
    { key: 'excluido',        label: 'Excluído (não escalar)',   emoji: '🚫' },
    { key: 'domingoOnly',     label: 'Somente Domingos',         emoji: '📅' },
    { key: 'portaLateralOnly', label: 'Somente Porta Lateral',   emoji: '🚪' },
    { key: 'pulpitoOnly',     label: 'Somente Púlpito',          emoji: '🎤' },
    { key: 'semPulpito',      label: 'Nunca no Púlpito',         emoji: '🚫🎤' },
    { key: 'recepcaoOnly',    label: 'Somente Recepção',         emoji: '🤝' },
    { key: 'visitantesOnly',  label: 'Somente Visitantes',       emoji: '🚶' },
    { key: 'frenteOnly',      label: 'Somente Frente da Igreja', emoji: '🏛️' },
    { key: 'isCoord',         label: 'Pool Coordenação',         emoji: '🎯' },
    { key: 'isVisitantesF',   label: 'Pool Visitantes ♀',        emoji: '🚶‍♀️' },
    { key: 'isTercaQuinta',   label: 'Apenas Terça/Quinta',      emoji: '📆' },
    { key: 'isDomingo1x',     label: 'Máx 1 Domingo/mês',        emoji: '1️⃣' },
  ];

  return (
    <div style={B.overlay} onClick={onClose}>
      <div style={{ ...B.modal, maxWidth: 600, maxHeight: '85vh' }} onClick={e => e.stopPropagation()}>
        <h3 style={{ marginBottom: 20, color: '#f0b84a' }}>
          {isEditing ? `Editar ${form.cargo === 'PROF' ? 'Professor' : 'Obreiro'}` : 'Novo Cadastro'}
        </h3>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {/* Nome */}
          <input
            type="text"
            placeholder="Nome completo"
            value={form.name}
            onChange={e => set('name', e.target.value)}
            style={B.inp}
          />

          {/* Cargo + Sexo */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <select value={form.cargo} onChange={e => set('cargo', e.target.value as Obreiro['cargo'])} style={B.select}>
              <optgroup label="Obreiros">
                <option value="CP">CP — Cooperador/a</option>
                <option value="DC">DC — Diácono/Diaconisa</option>
                <option value="PB">PB — Presbítero</option>
                <option value="EV">EV — Evangelista</option>
              </optgroup>
              <optgroup label="EBD">
                <option value="PROF">PROF — Professor EBD</option>
              </optgroup>
            </select>
            <select value={form.sexo} onChange={e => set('sexo', e.target.value as 'M' | 'F')} style={B.select}>
              <option value="M">Masculino</option>
              <option value="F">Feminino</option>
            </select>
          </div>

          {/* Nascimento + Telefone */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <input
              type="text"
              placeholder="Nascimento (DD/MM/AAAA)"
              value={form.nasc}
              onChange={e => set('nasc', maskDate(e.target.value))}
              style={B.inp}
            />
            <input
              type="text"
              placeholder="Telefone"
              value={form.tel}
              onChange={e => set('tel', maskPhone(e.target.value))}
              style={B.inp}
            />
          </div>

          {/* Flags - somente para obreiros (não professores) */}
          {form.cargo !== 'PROF' && <div style={{ marginTop: 10 }}>
            <p style={{ fontSize: 13, color: '#94a3b8', marginBottom: 8, fontWeight: 600 }}>Restrições / Pools:</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
              {FLAG_OPTIONS.map(({ key, label, emoji }) => (
                <label key={key} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '6px 10px',
                  background: form[key as keyof typeof form] ? 'rgba(99,102,241,.15)' : 'rgba(255,255,255,.03)',
                  borderRadius: 8,
                  cursor: 'pointer',
                  fontSize: 12,
                  border: `1px solid ${form[key as keyof typeof form] ? 'rgba(99,102,241,.3)' : 'rgba(255,255,255,.06)'}`,
                }}>
                  <input
                    type="checkbox"
                    checked={!!form[key as keyof typeof form]}
                    onChange={e => set(key as keyof typeof form, e.target.checked as never)}
                    style={{ accentColor: '#6366f1' }}
                  />
                  {emoji} {label}
                </label>
              ))}
            </div>
          </div>

          }

          {/* Campos de texto extras - somente obreiros */}
          {form.cargo !== 'PROF' && (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 8 }}>
                <div>
                  <label style={{ fontSize: 12, color: '#94a3b8' }}>Par (pairWith)</label>
                  <input
                    type="text"
                    placeholder="Nome do par..."
                    value={form.pairWith || ''}
                    onChange={e => set('pairWith', e.target.value)}
                    style={B.inp}
                  />
                </div>
                <div>
                  <label style={{ fontSize: 12, color: '#94a3b8' }}>Segue Visitantes F</label>
                  <input
                    type="text"
                    placeholder="Nome da obreira..."
                    value={form.segueVisitantesF || ''}
                    onChange={e => set('segueVisitantesF', e.target.value)}
                    style={B.inp}
                  />
                </div>
              </div>

              <div style={{ maxWidth: 200 }}>
                <label style={{ fontSize: 12, color: '#94a3b8' }}>Máx. cultos/mês</label>
                <input
                  type="number"
                  min={0}
                  value={form.maxCultos || 0}
                  onChange={e => set('maxCultos', parseInt(e.target.value) || 0)}
                  style={B.inp}
                />
              </div>
            </>
          )}

          {/* Botões */}
          <div style={{ display: 'flex', gap: 10, marginTop: 15, justifyContent: 'space-between' }}>
            <div>
              {isEditing && onDelete && (
                showDeleteConfirm ? (
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button type="button" style={B.btnDanger} onClick={() => { onDelete(obreiro!); onClose(); }}>
                      Confirmar exclusão
                    </button>
                    <button type="button" style={B.btnOutline} onClick={() => setShowDeleteConfirm(false)}>
                      Cancelar
                    </button>
                  </div>
                ) : (
                  <button type="button" style={{ ...B.btnOutline, color: '#f87171' }} onClick={() => setShowDeleteConfirm(true)}>
                    Excluir
                  </button>
                )
              )}
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button type="button" style={B.btnOutline} onClick={onClose}>Cancelar</button>
              <button type="submit" style={B.btn}>Salvar</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
