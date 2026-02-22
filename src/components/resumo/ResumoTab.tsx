import { useMemo } from 'react';
import { ScheduleEntry, Obreiro, Absences, Contagem } from '../../types';
import { FM, CARGO_COLOR, CARGO_BG, CARGO_LABELS, MESES_LABELS } from '../../config/constants';
import { B } from '../../config/theme';

interface Props {
  schedule: ScheduleEntry[];
  obreiros: Obreiro[];
  absences: Absences;
  errors: string[];
  warnings: string[];
  newContagem: Contagem;
  mes: number;
}

export default function ResumoTab({ schedule, obreiros, absences, errors, warnings, newContagem, mes }: Props) {
  // Participação por obreiro
  const participacao = useMemo(() => {
    const counts: Record<string, number> = {};
    schedule.forEach(entry => {
      Object.values(entry.slots).forEach(val => {
        const names = Array.isArray(val) ? val : val ? [val] : [];
        names.forEach(n => { counts[n] = (counts[n] || 0) + 1; });
      });
    });
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1]);
  }, [schedule]);

  // Por função
  const porFuncao = useMemo(() => {
    const counts: Record<string, number> = {};
    schedule.forEach(entry => {
      FM.forEach(m => {
        if (m.santaCeiaOnly && !entry.culto.santaCeia) return;
        const val = entry.slots[m.key as keyof typeof entry.slots];
        const names = Array.isArray(val) ? val : val ? [val] : [];
        counts[m.key] = (counts[m.key] || 0) + names.length;
      });
    });
    return counts;
  }, [schedule]);

  // Justificativas do mês
  const justificativas = useMemo(() => {
    const list: { date: string; name: string; text: string }[] = [];
    Object.entries(absences).forEach(([date, dateAbs]) => {
      Object.entries(dateAbs).forEach(([name, rec]) => {
        list.push({ date, name, text: rec.justificativa });
      });
    });
    return list.sort((a, b) => a.date.localeCompare(b.date));
  }, [absences]);

  // Quadro de membros (obreiros + professores)
  const quadro = useMemo(() => {
    const active = obreiros.filter(o => !o.excluido);
    const byCargoArr = Object.entries(
      active.reduce<Record<string, Obreiro[]>>((acc, o) => {
        (acc[o.cargo] = acc[o.cargo] || []).push(o);
        return acc;
      }, {})
    ).sort((a, b) => b[1].length - a[1].length);
    return {
      total: active.length,
      obreiros: active.filter(o => o.cargo !== 'PROF').length,
      professores: active.filter(o => o.cargo === 'PROF').length,
      m: active.filter(o => o.sexo === 'M').length,
      f: active.filter(o => o.sexo === 'F').length,
      byCargo: byCargoArr,
    };
  }, [obreiros]);

  const maxCount = participacao.length > 0 ? participacao[0][1] : 1;

  return (
    <div style={{ padding: '0 20px', animation: 'fadeIn .3s ease' }}>
      <h2 style={{ color: '#f0b84a', marginBottom: 20, fontSize: 18 }}>
        📊 Resumo — {MESES_LABELS[mes - 1]}
      </h2>

      {/* Alertas */}
      {(errors.length > 0 || warnings.length > 0) && (
        <div style={{ ...B.card, marginBottom: 15 }}>
          <h3 style={{ fontSize: 14, color: '#f87171', marginBottom: 10 }}>Validações</h3>
          {errors.map((e, i) => (
            <p key={`e${i}`} style={{ fontSize: 13, color: '#f87171', marginBottom: 4 }}>{e}</p>
          ))}
          {warnings.map((w, i) => (
            <p key={`w${i}`} style={{ fontSize: 13, color: '#fbbf24', marginBottom: 4 }}>{w}</p>
          ))}
          {errors.length === 0 && warnings.length === 0 && (
            <p style={{ fontSize: 13, color: '#34d399' }}>✅ Nenhum problema encontrado</p>
          )}
        </div>
      )}

      {/* Justificativas */}
      {justificativas.length > 0 && (
        <div style={{ ...B.card, marginBottom: 15 }}>
          <h3 style={{ fontSize: 14, color: '#f59e0b', marginBottom: 10 }}>
            📝 Justificativas de Falta ({justificativas.length})
          </h3>
          {justificativas.map((j, i) => (
            <div key={i} style={{
              padding: '8px 12px',
              background: 'rgba(255,255,255,.03)',
              borderRadius: 8,
              marginBottom: 6,
              fontSize: 13,
            }}>
              <strong style={{ color: '#f0b84a' }}>{j.name.split(' ').slice(0, 2).join(' ')}</strong>
              <span style={{ color: '#64748b' }}> ({j.date})</span>
              <p style={{ color: '#94a3b8', marginTop: 2 }}>{j.text}</p>
            </div>
          ))}
        </div>
      )}

      {/* Quadro de Membros */}
      <div style={{ ...B.card, marginBottom: 15 }}>
        <h3 style={{ fontSize: 14, color: '#60a5fa', marginBottom: 10 }}>
          👥 Quadro de Membros ({quadro.total} ativos)
        </h3>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 12 }}>
          <span style={{ fontSize: 12, color: '#94a3b8' }}>
            ⛪ {quadro.obreiros} obreiros
          </span>
          <span style={{ fontSize: 12, color: '#94a3b8' }}>·</span>
          <span style={{ fontSize: 12, color: '#94a3b8' }}>
            📖 {quadro.professores} professores
          </span>
          <span style={{ fontSize: 12, color: '#94a3b8' }}>·</span>
          <span style={{ fontSize: 12, color: '#94a3b8' }}>
            {quadro.m}♂ {quadro.f}♀
          </span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 8 }}>
          {quadro.byCargo.map(([cargo, members]) => (
            <div key={cargo} style={{
              background: CARGO_BG[cargo],
              borderRadius: 10,
              padding: '10px 14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <div>
                <span style={{ color: CARGO_COLOR[cargo], fontWeight: 700, fontSize: 13 }}>{cargo}</span>
                <p style={{ color: CARGO_COLOR[cargo], fontSize: 10, opacity: 0.8 }}>
                  {CARGO_LABELS[cargo]}
                </p>
              </div>
              <span style={{ color: CARGO_COLOR[cargo], fontWeight: 800, fontSize: 18 }}>{members.length}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Participação por obreiro */}
      <div style={{ ...B.card, marginBottom: 15 }}>
        <h3 style={{ fontSize: 14, color: '#818cf8', marginBottom: 10 }}>
          📈 Participação ({participacao.length} obreiros)
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, maxHeight: 400, overflow: 'auto' }}>
          {participacao.map(([name, count]) => {
            const o = obreiros.find(ob => ob.name === name);
            const color = CARGO_COLOR[o?.cargo || 'CP'];
            return (
              <div key={name} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 12 }}>
                <span style={{ minWidth: 160, color: '#f1f5f9', fontWeight: 500 }}>
                  {name.split(' ').slice(0, 2).join(' ')}
                </span>
                <div style={{ flex: 1, height: 16, background: 'rgba(255,255,255,.05)', borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{
                    width: `${(count / maxCount) * 100}%`,
                    height: '100%',
                    background: `${color}60`,
                    borderRadius: 4,
                    transition: 'width .3s ease',
                  }} />
                </div>
                <span style={{ minWidth: 24, textAlign: 'right', color, fontWeight: 700 }}>{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Por Função */}
      <div style={{ ...B.card, marginBottom: 15 }}>
        <h3 style={{ fontSize: 14, color: '#34d399', marginBottom: 10 }}>📋 Por Função</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 8 }}>
          {FM.map(m => (
            <div key={m.key} style={{
              background: m.bg,
              borderRadius: 10,
              padding: '10px 14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <span style={{ color: m.color, fontWeight: 600, fontSize: 12 }}>{m.icon} {m.label}</span>
              <span style={{ color: m.color, fontWeight: 800, fontSize: 16 }}>{porFuncao[m.key] || 0}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
