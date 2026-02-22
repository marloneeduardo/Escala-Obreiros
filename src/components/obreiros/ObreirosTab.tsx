import { useState, useMemo } from 'react';
import { Obreiro } from '../../types';
import { CARGO_COLOR, CARGO_BG, CARGO_LABELS } from '../../config/constants';
import { B } from '../../config/theme';
import ObreiroForm from './ObreiroForm';

interface Props {
  obreiros: Obreiro[];
  onSave: (obreiro: Obreiro) => void;
  onDelete: (obreiro: Obreiro) => void;
  addToast: (type: 'success' | 'error' | 'warning' | 'info', msg: string) => void;
}

export default function ObreirosTab({ obreiros, onSave, onDelete, addToast }: Props) {
  const [search, setSearch] = useState('');
  const [cargoFilter, setCargoFilter] = useState('');
  const [tipoFilter, setTipoFilter] = useState<'todos' | 'obreiros' | 'professores'>('todos');
  const [editing, setEditing] = useState<Obreiro | null>(null);
  const [showNew, setShowNew] = useState(false);

  const filtered = useMemo(() => {
    return obreiros
      .filter(o => !search || o.name.toLowerCase().includes(search.toLowerCase()))
      .filter(o => !cargoFilter || o.cargo === cargoFilter)
      .filter(o => {
        if (tipoFilter === 'obreiros') return o.cargo !== 'PROF';
        if (tipoFilter === 'professores') return o.cargo === 'PROF';
        return true;
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [obreiros, search, cargoFilter, tipoFilter]);

  const stats = useMemo(() => {
    const active = obreiros.filter(o => !o.excluido);
    const obr = active.filter(o => o.cargo !== 'PROF');
    const prof = active.filter(o => o.cargo === 'PROF');
    return {
      total: obreiros.length,
      active: active.length,
      obreiros: obr.length,
      professores: prof.length,
      m: active.filter(o => o.sexo === 'M').length,
      f: active.filter(o => o.sexo === 'F').length,
    };
  }, [obreiros]);

  const FLAGS_DISPLAY: { key: keyof Obreiro; label: string; emoji: string }[] = [
    { key: 'isCoord', label: 'Coord', emoji: '🎯' },
    { key: 'isVisitantesF', label: 'Visit♀', emoji: '🚶‍♀️' },
    { key: 'isTercaQuinta', label: 'Ter/Qui', emoji: '📆' },
    { key: 'isDomingo1x', label: '1×Dom', emoji: '1️⃣' },
    { key: 'domingoOnly', label: 'DomOnly', emoji: '📅' },
    { key: 'portaLateralOnly', label: 'Porta', emoji: '🚪' },
    { key: 'pulpitoOnly', label: 'Púlpito', emoji: '🎤' },
    { key: 'semPulpito', label: 'S/Púlp', emoji: '🚫' },
    { key: 'excluido', label: 'Excluído', emoji: '🚫' },
  ];

  return (
    <div style={{ padding: '0 20px', animation: 'fadeIn .3s ease' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 15, flexWrap: 'wrap', gap: 10 }}>
        <h2 style={{ color: '#f0b84a', fontSize: 18, margin: 0 }}>👥 Cadastros</h2>
        <div style={{ display: 'flex', gap: 8, fontSize: 12, color: '#94a3b8' }}>
          <span>{stats.obreiros} obreiros</span>·
          <span>{stats.professores} professores</span>·
          <span>{stats.m}♂</span>·
          <span>{stats.f}♀</span>·
          <span>{stats.total} total</span>
        </div>
      </div>

      {/* Filtro por tipo */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
        {(['todos', 'obreiros', 'professores'] as const).map(tipo => (
          <button
            key={tipo}
            onClick={() => setTipoFilter(tipo)}
            style={{
              background: tipoFilter === tipo ? 'rgba(99,102,241,.2)' : 'rgba(255,255,255,.04)',
              color: tipoFilter === tipo ? '#818cf8' : '#94a3b8',
              border: `1px solid ${tipoFilter === tipo ? 'rgba(99,102,241,.3)' : 'rgba(255,255,255,.08)'}`,
              borderRadius: 8,
              padding: '6px 14px',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            {tipo === 'todos' ? 'Todos' : tipo === 'obreiros' ? '⛪ Obreiros' : '📖 Professores'}
          </button>
        ))}
      </div>

      {/* Filtros */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 15, flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="Buscar por nome..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ ...B.inp, flex: 1, minWidth: 200 }}
        />
        <select value={cargoFilter} onChange={e => setCargoFilter(e.target.value)} style={B.select}>
          <option value="">Todos os cargos</option>
          {Object.entries(CARGO_LABELS).map(([k, v]) => (
            <option key={k} value={k}>{k} — {v}</option>
          ))}
        </select>
        <button style={B.btn} onClick={() => setShowNew(true)}>+ Adicionar</button>
      </div>

      {/* Lista */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {filtered.map(o => (
          <div
            key={o.id}
            onClick={() => setEditing(o)}
            style={{
              background: o.excluido ? 'rgba(239,68,68,.05)' : 'rgba(255,255,255,.04)',
              border: `1px solid ${o.excluido ? 'rgba(239,68,68,.15)' : 'rgba(255,255,255,.08)'}`,
              borderRadius: 12,
              padding: '12px 16px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              opacity: o.excluido ? 0.5 : 1,
              transition: 'all .15s ease',
            }}
            className="hover-card"
          >
            <span style={{
              background: CARGO_BG[o.cargo],
              color: CARGO_COLOR[o.cargo],
              border: `1px solid ${CARGO_COLOR[o.cargo]}33`,
              borderRadius: 8,
              padding: '4px 10px',
              fontSize: 11,
              fontWeight: 800,
              minWidth: 42,
              textAlign: 'center',
            }}>{o.cargo}</span>

            <div style={{ flex: 1 }}>
              <p style={{ fontWeight: 600, fontSize: 14 }}>{o.name}</p>
              <p style={{ fontSize: 11, color: '#64748b' }}>{o.tel} · {o.nasc}</p>
            </div>

            {/* Flags ativas (somente para obreiros) */}
            {o.cargo !== 'PROF' && (
              <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                {FLAGS_DISPLAY.filter(f => o[f.key as keyof Obreiro]).map(f => (
                  <span key={f.key} title={f.label} style={{
                    background: 'rgba(99,102,241,.1)',
                    color: '#818cf8',
                    borderRadius: 4,
                    padding: '2px 5px',
                    fontSize: 9,
                  }}>{f.emoji}</span>
                ))}
              </div>
            )}

            {/* Badge Professor */}
            {o.cargo === 'PROF' && (
              <span style={{
                background: 'rgba(249,115,22,.1)',
                color: '#f97316',
                borderRadius: 6,
                padding: '3px 8px',
                fontSize: 10,
                fontWeight: 700,
              }}>📖 EBD</span>
            )}
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <p style={{ color: '#64748b', textAlign: 'center', padding: 40 }}>
          Nenhum cadastro encontrado.
        </p>
      )}

      {/* Modais */}
      {editing && (
        <ObreiroForm
          obreiro={editing}
          obreiros={obreiros}
          onSave={onSave}
          onDelete={onDelete}
          onClose={() => setEditing(null)}
          addToast={addToast}
        />
      )}
      {showNew && (
        <ObreiroForm
          obreiros={obreiros}
          onSave={onSave}
          onClose={() => setShowNew(false)}
          addToast={addToast}
        />
      )}
    </div>
  );
}
