import { useState, useRef } from 'react';
import { Config, Obreiro, Contagem, Overrides, Absences, EbdData } from '../../types';
import { MESES_LABELS, DEFAULT_SCHED_CONF } from '../../config/constants';
import { B } from '../../config/theme';
import { exportBackup, importBackup } from '../../lib/backup';

interface Props {
  config: Config;
  obreiros: Obreiro[];
  contagem: Contagem;
  savedAt: string | null;
  overrides: Overrides;
  absences: Absences;
  ebdData: EbdData;
  newContagem: Contagem;
  onSaveConfig: (cfg: Config) => void;
  onSaveContagem: (counts: Contagem, savedAt: string | null) => void;
  onSaveOverrides: (ov: Overrides) => void;
  onSaveAbsences: (ab: Absences) => void;
  onImportAll: (data: { obreiros: Obreiro[]; config: Config; contagem: Contagem; overrides: Overrides; absences: Absences; ebd: EbdData }) => void;
  addToast: (type: 'success' | 'error' | 'warning' | 'info', msg: string) => void;
}

export default function ConfigTab({
  config, obreiros, contagem, savedAt, overrides, absences, ebdData,
  newContagem, onSaveConfig, onSaveContagem, onSaveOverrides, onSaveAbsences,
  onImportAll, addToast,
}: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [importLoading, setImportLoading] = useState(false);

  const updateConfig = (patch: Partial<Config>) => {
    onSaveConfig({ ...config, ...patch });
  };

  const updateSchedConf = (patch: Partial<Config['schedConf']>) => {
    updateConfig({ schedConf: { ...config.schedConf, ...patch } });
  };

  const handleExport = () => {
    exportBackup(obreiros, config, contagem, overrides, absences, ebdData);
    addToast('success', 'Backup exportado com sucesso');
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImportLoading(true);
    try {
      const data = await importBackup(file);
      onImportAll({
        obreiros: data.obreiros,
        config: data.config || config,
        contagem: data.contagem || {},
        overrides: data.overrides || {},
        absences: data.absences || {},
        ebd: data.ebd || ebdData,
      });
      addToast('success', 'Backup importado com sucesso');
    } catch (err) {
      addToast('error', `Erro na importação: ${(err as Error).message}`);
    } finally {
      setImportLoading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const handleSaveContagem = () => {
    const now = new Date().toISOString();
    onSaveContagem(newContagem, now);
    addToast('success', 'Contagem acumulada salva');
  };

  const handleResetContagem = () => {
    onSaveContagem({}, null);
    addToast('info', 'Contagem zerada');
  };

  return (
    <div style={{ padding: '0 20px', animation: 'fadeIn .3s ease' }}>
      <h2 style={{ color: '#f0b84a', marginBottom: 20, fontSize: 18 }}>⚙️ Configurações</h2>

      {/* Mês e Ano */}
      <div style={{ ...B.card, marginBottom: 15 }}>
        <h3 style={{ fontSize: 14, color: '#818cf8', marginBottom: 12 }}>📅 Período</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
          <div>
            <label style={{ fontSize: 12, color: '#94a3b8' }}>Mês</label>
            <select
              value={config.mes}
              onChange={e => updateConfig({ mes: parseInt(e.target.value) })}
              style={B.select}
            >
              {MESES_LABELS.map((m, i) => (
                <option key={i} value={i + 1}>{m}</option>
              ))}
            </select>
          </div>
          <div>
            <label style={{ fontSize: 12, color: '#94a3b8' }}>Ano</label>
            <select
              value={config.ano}
              onChange={e => updateConfig({ ano: parseInt(e.target.value) })}
              style={B.select}
            >
              {[2025, 2026, 2027, 2028].map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
          <div>
            <label style={{ fontSize: 12, color: '#94a3b8' }}>Máx cultos/pessoa</label>
            <input
              type="number"
              min={0}
              value={config.maxPerPerson}
              onChange={e => updateConfig({ maxPerPerson: parseInt(e.target.value) || 0 })}
              style={B.inp}
            />
          </div>
        </div>
      </div>

      {/* Regras de culto */}
      <div style={{ ...B.card, marginBottom: 15 }}>
        <h3 style={{ fontSize: 14, color: '#818cf8', marginBottom: 12 }}>📋 Regras de Culto</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {[
            { key: 'allSundays' as const, label: 'Todos os Domingos' },
            { key: 'allTuesdays' as const, label: 'Todas as Terças' },
            { key: 'firstSatOnly' as const, label: 'Primeiro Sábado apenas' },
            { key: 'biWeekThursday' as const, label: 'Quintas quinzenais' },
          ].map(({ key, label }) => (
            <label key={key} style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '8px 12px',
              background: config.schedConf[key] ? 'rgba(99,102,241,.1)' : 'rgba(255,255,255,.03)',
              borderRadius: 8,
              cursor: 'pointer',
              fontSize: 13,
            }}>
              <input
                type="checkbox"
                checked={config.schedConf[key]}
                onChange={e => updateSchedConf({ [key]: e.target.checked })}
                style={{ accentColor: '#6366f1' }}
              />
              {label}
            </label>
          ))}
        </div>

        {config.schedConf.biWeekThursday && (
          <div style={{ marginTop: 10 }}>
            <label style={{ fontSize: 12, color: '#94a3b8' }}>Quintas: começar pela</label>
            <select
              value={config.schedConf.biWeekThurStart}
              onChange={e => updateSchedConf({ biWeekThurStart: parseInt(e.target.value) })}
              style={B.select}
            >
              <option value={0}>1ª e 3ª quintas</option>
              <option value={1}>2ª e 4ª quintas</option>
            </select>
          </div>
        )}
      </div>

      {/* Contagem Acumulada */}
      <div style={{ ...B.card, marginBottom: 15 }}>
        <h3 style={{ fontSize: 14, color: '#818cf8', marginBottom: 12 }}>📊 Contagem Acumulada</h3>
        {savedAt && (
          <p style={{ fontSize: 12, color: '#94a3b8', marginBottom: 10 }}>
            Último save: {new Date(savedAt).toLocaleString('pt-BR')}
          </p>
        )}
        <div style={{ display: 'flex', gap: 10 }}>
          <button style={B.btn} onClick={handleSaveContagem}>💾 Salvar Contagem</button>
          <button style={B.btnOutline} onClick={handleResetContagem}>🔄 Zerar Contagem</button>
        </div>
      </div>

      {/* Manutenção */}
      <div style={{ ...B.card, marginBottom: 15 }}>
        <h3 style={{ fontSize: 14, color: '#818cf8', marginBottom: 12 }}>🔧 Manutenção</h3>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button
            style={B.btnOutline}
            onClick={() => { onSaveOverrides({}); addToast('info', 'Overrides limpos'); }}
          >
            🗑️ Limpar Overrides
          </button>
          <button
            style={B.btnOutline}
            onClick={() => { onSaveAbsences({}); addToast('info', 'Justificativas limpas'); }}
          >
            🗑️ Limpar Justificativas
          </button>
        </div>
      </div>

      {/* Backup */}
      <div style={{ ...B.card, marginBottom: 15 }}>
        <h3 style={{ fontSize: 14, color: '#818cf8', marginBottom: 12 }}>💾 Backup</h3>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button style={B.btn} onClick={handleExport}>📤 Exportar JSON</button>
          <button
            style={B.btnGold}
            onClick={() => fileRef.current?.click()}
            disabled={importLoading}
          >
            {importLoading ? 'Importando...' : '📥 Importar JSON'}
          </button>
          <input
            ref={fileRef}
            type="file"
            accept=".json"
            onChange={handleImport}
            style={{ display: 'none' }}
          />
        </div>
      </div>
    </div>
  );
}
