import { useMemo } from 'react';
import { EbdData, EbdClassRow } from '../../types';
import { MESES_LABELS, DEFAULT_EBD_CLASSES } from '../../config/constants';
import { B } from '../../config/theme';
import { printEbd } from '../../lib/print';

interface Props {
  ebdData: EbdData;
  mes: number;
  ano: number;
  isAdmin: boolean;
  onSave: (data: EbdData) => void;
  addToast: (type: 'success' | 'error' | 'warning' | 'info', msg: string) => void;
}

export default function EbdTab({ ebdData, mes, ano, isAdmin, onSave, addToast }: Props) {
  // Gerar domingos do mês
  const domingos = useMemo(() => {
    const dim = new Date(ano, mes, 0).getDate();
    const suns: string[] = [];
    for (let d = 1; d <= dim; d++) {
      if (new Date(ano, mes - 1, d).getDay() === 0) {
        suns.push(`${String(d).padStart(2, '0')}/${String(mes).padStart(2, '0')}/${ano}`);
      }
    }
    return suns;
  }, [mes, ano]);

  // Garantir que as classes tenham rows para cada domingo
  const classes = useMemo(() => {
    return (ebdData.classes.length > 0 ? ebdData.classes : DEFAULT_EBD_CLASSES).map(cls => ({
      ...cls,
      rows: domingos.map((data, i) => {
        const existing = cls.rows?.[i];
        return {
          data,
          licao: existing?.licao || '',
          prof: existing?.prof || '',
        };
      }),
    }));
  }, [ebdData.classes, domingos]);

  const updateField = (field: keyof EbdData, value: string) => {
    onSave({ ...ebdData, [field]: value });
  };

  const updateClassRow = (classIdx: number, rowIdx: number, field: keyof EbdClassRow, value: string) => {
    const updated = classes.map((cls, ci) => {
      if (ci !== classIdx) return cls;
      return {
        ...cls,
        rows: cls.rows.map((r, ri) => ri === rowIdx ? { ...r, [field]: value } : r),
      };
    });
    onSave({ ...ebdData, classes: updated });
  };

  return (
    <div style={{ padding: '0 20px', animation: 'fadeIn .3s ease' }}>
      {/* Header EBD */}
      <div style={{
        background: 'linear-gradient(135deg, #92400e, #d97706, #92400e)',
        borderRadius: 16,
        padding: '20px 24px',
        textAlign: 'center',
        marginBottom: 20,
      }}>
        <h2 style={{ fontSize: 20, fontWeight: 800, margin: 0 }}>📖 Escola Bíblica Dominical</h2>
        <p style={{ fontSize: 13, opacity: 0.9, marginTop: 4 }}>ADJIPA</p>
        <p style={{ fontSize: 15, fontWeight: 600, marginTop: 2 }}>{MESES_LABELS[mes - 1]} de {ano}</p>
      </div>

      {/* Superintendentes */}
      <div style={{ ...B.card, marginBottom: 15 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
          {(['sup1', 'sup2', 'sup3'] as const).map((key, i) => (
            <div key={key}>
              <label style={{ fontSize: 11, color: '#94a3b8' }}>{i + 1}º Superintendente</label>
              <input
                type="text"
                value={ebdData[key] || ''}
                onChange={e => isAdmin && updateField(key, e.target.value)}
                readOnly={!isAdmin}
                style={B.inp}
              />
            </div>
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 10 }}>
          <div>
            <label style={{ fontSize: 11, color: '#94a3b8' }}>Secretaria</label>
            <input
              type="text"
              value={ebdData.secretaria || ''}
              onChange={e => isAdmin && updateField('secretaria', e.target.value)}
              readOnly={!isAdmin}
              style={B.inp}
            />
          </div>
          <div>
            <label style={{ fontSize: 11, color: '#94a3b8' }}>Tesoureira</label>
            <input
              type="text"
              value={ebdData.tesoureira || ''}
              onChange={e => isAdmin && updateField('tesoureira', e.target.value)}
              readOnly={!isAdmin}
              style={B.inp}
            />
          </div>
        </div>
        <p style={{ fontSize: 12, color: '#94a3b8', fontStyle: 'italic', marginTop: 10 }}>
          Dc. Rosimar Alves Ferreira
        </p>
      </div>

      {/* Tabela de Classes */}
      {classes.map((cls, ci) => (
        <div key={cls.id} style={{ marginBottom: 15 }}>
          <div style={{
            background: `${cls.color}20`,
            borderRadius: '12px 12px 0 0',
            padding: '10px 16px',
            borderBottom: `2px solid ${cls.color}`,
          }}>
            <span style={{ fontWeight: 800, color: cls.color, fontSize: 14 }}>{cls.nome}</span>
            <span style={{ fontSize: 12, color: '#94a3b8', marginLeft: 8 }}>{cls.sub}</span>
          </div>

          <div style={{
            background: 'rgba(255,255,255,.03)',
            borderRadius: '0 0 12px 12px',
            overflow: 'hidden',
          }}>
            {/* Header da tabela */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '100px 1fr 1fr',
              background: 'rgba(255,255,255,.05)',
              padding: '6px 12px',
              fontSize: 11,
              fontWeight: 700,
              color: '#94a3b8',
            }}>
              <span>DATA</span>
              <span>LIÇÃO</span>
              <span>PROFESSOR</span>
            </div>

            {cls.rows.map((row, ri) => (
              <div key={ri} style={{
                display: 'grid',
                gridTemplateColumns: '100px 1fr 1fr',
                padding: '6px 12px',
                borderBottom: '1px solid rgba(255,255,255,.04)',
                alignItems: 'center',
              }}>
                <span style={{ fontSize: 13, color: '#f1f5f9' }}>{row.data.slice(0, 5)}</span>
                <input
                  type="text"
                  value={row.licao}
                  onChange={e => isAdmin && updateClassRow(ci, ri, 'licao', e.target.value)}
                  readOnly={!isAdmin}
                  placeholder="Lição..."
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#f1f5f9',
                    fontSize: 13,
                    padding: '4px 8px',
                    borderBottom: isAdmin ? '1px solid rgba(255,255,255,.1)' : 'none',
                  }}
                />
                <input
                  type="text"
                  value={row.prof}
                  onChange={e => isAdmin && updateClassRow(ci, ri, 'prof', e.target.value)}
                  readOnly={!isAdmin}
                  placeholder="Professor..."
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#f1f5f9',
                    fontSize: 13,
                    padding: '4px 8px',
                    borderBottom: isAdmin ? '1px solid rgba(255,255,255,.1)' : 'none',
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Botão Imprimir */}
      <button
        onClick={() => printEbd(({ ...ebdData, classes }), mes, ano)}
        style={{ ...B.btn, marginTop: 10, marginBottom: 20 }}
      >
        🖨️ Imprimir EBD
      </button>
    </div>
  );
}
