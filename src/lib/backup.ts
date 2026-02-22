import { Obreiro, Config, Contagem, Overrides, Absences, EbdData } from '../types';

interface BackupData {
  version: 2;
  exportedAt: string;
  obreiros: Obreiro[];
  config: Config;
  contagem: Contagem;
  overrides: Overrides;
  absences: Absences;
  ebd: EbdData;
}

export function exportBackup(
  obreiros: Obreiro[],
  config: Config,
  contagem: Contagem,
  overrides: Overrides,
  absences: Absences,
  ebd: EbdData
) {
  const data: BackupData = {
    version: 2,
    exportedAt: new Date().toISOString(),
    obreiros,
    config,
    contagem,
    overrides,
    absences,
    ebd,
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `escala-obreiros-backup-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function importBackup(
  file: File
): Promise<BackupData> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        if (!data.obreiros || !Array.isArray(data.obreiros)) {
          reject(new Error('Arquivo inválido: lista de obreiros não encontrada'));
          return;
        }
        resolve(data as BackupData);
      } catch {
        reject(new Error('Arquivo JSON inválido'));
      }
    };
    reader.onerror = () => reject(new Error('Erro ao ler arquivo'));
    reader.readAsText(file);
  });
}
