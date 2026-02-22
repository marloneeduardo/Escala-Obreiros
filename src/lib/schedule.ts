import { Obreiro, Culto, ScheduleEntry, ScheduleSlots, Contagem, Overrides, Absences, SchedConf } from '../types';
import { DW, SANTA_CEIA_EXCLUDED } from '../config/constants';

/**
 * Gera a lista de cultos do mês baseado na configuração
 */
export function gerarCultos(
  mes: number,
  ano: number,
  schedConf: SchedConf,
  labels: Record<string, string> = {}
): Culto[] {
  const dim = new Date(ano, mes, 0).getDate();
  const out: Culto[] = [];
  let sundayCount = 0;
  let thursdayCount = 0;
  let saturdayCount = 0;

  for (let d = 1; d <= dim; d++) {
    const dow = new Date(ano, mes - 1, d).getDay();
    const dia = DW.find(x => x.dow === dow);
    if (!dia) continue;

    let include = false;

    if (dia.type === 'domingo' && schedConf.allSundays) {
      include = true;
      sundayCount++;
    } else if (dia.type === 'terca' && schedConf.allTuesdays) {
      include = true;
    } else if (dia.type === 'quinta' && schedConf.biWeekThursday) {
      thursdayCount++;
      const start = schedConf.biWeekThurStart || 0;
      if (start === 0) {
        include = thursdayCount % 2 === 1; // 1ª e 3ª
      } else {
        include = thursdayCount % 2 === 0; // 2ª e 4ª
      }
    } else if (dia.type === 'sabado' && schedConf.firstSatOnly) {
      saturdayCount++;
      if (saturdayCount === 1) include = true;
    }

    if (include) {
      const ds = `${String(d).padStart(2, '0')}/${String(mes).padStart(2, '0')}/${ano}`;
      const santaCeia = dia.type === 'domingo' && sundayCount === 1;
      out.push({
        id: out.length,
        date: ds,
        weekday: dia.short,
        type: dia.type,
        label: labels[ds] || '',
        santaCeia,
      });
    }
  }

  return out;
}

/**
 * Algoritmo principal de geração da escala
 */
export function buildSchedule(
  OBS: Obreiro[],
  cultos: Culto[],
  base: Contagem = {},
  overrides: Overrides = {},
  absences: Absences = {},
  maxPerPerson = 0
): { schedule: ScheduleEntry[]; newContagem: Contagem; warnings: string[] } {
  const warnings: string[] = [];

  // Excluir professores EBD da escala de cultos
  const OBR = OBS.filter(o => o.cargo !== 'PROF');

  // Pools especiais
  const COORD = OBR.filter(o => o.isCoord && !o.excluido).map(o => o.name);
  const VISITF = OBR.filter(o => o.isVisitantesF && !o.excluido).map(o => o.name);
  const WTQ = OBR.filter(o => o.isTercaQuinta && !o.excluido && o.sexo === 'F').map(o => o.name);
  const W1X = OBR.filter(o => o.isDomingo1x && !o.excluido && o.sexo === 'F').map(o => o.name);
  const PORTA = OBR.filter(o => o.portaLateralOnly && !o.excluido).map(o => o.name);

  const ob = (n: string) => OBS.find(o => o.name === n);

  // Funções para verificar se obreiro é de pool especial
  const specM = (o: Obreiro) => o.isCoord || o.portaLateralOnly || o.recepcaoOnly || o.visitantesOnly || o.frenteOnly || o.isDomingo1x;
  const specF = (o: Obreiro) => o.isVisitantesF || o.isTercaQuinta || o.isDomingo1x || o.portaLateralOnly || o.visitantesOnly || o.frenteOnly;

  // Pools gerais
  const MG = OBR.filter(o => o.sexo === 'M' && !o.excluido && !specM(o) && !o.pulpitoOnly).map(o => o.name);
  const MP = OBR.filter(o => o.sexo === 'M' && !o.excluido && !o.portaLateralOnly && !o.semPulpito && !o.recepcaoOnly && !o.visitantesOnly && !o.frenteOnly && (!o.isCoord || o.pulpitoOnly)).map(o => o.name);
  const DCP = MP.filter(n => ob(n)?.cargo === 'DC');
  const WG = OBR.filter(o => o.sexo === 'F' && !o.excluido && !specF(o) && !o.recepcaoOnly).map(o => o.name);

  // Pool de Santa Ceia: somente DCs, excluindo os da lista
  const SANTA_CEIA_POOL = OBR.filter(
    o => o.cargo === 'DC' && !o.excluido && !SANTA_CEIA_EXCLUDED.includes(o.name)
  ).map(o => o.name);

  // Pool frente da igreja
  const FRENTE = OBR.filter(o => o.frenteOnly && !o.excluido).map(o => o.name);
  const WG_FRENTE = [...WG]; // Mulheres gerais para frente

  // Contadores
  const cnt: Contagem = {};
  const monthCount: Record<string, number> = {};
  OBR.forEach(o => {
    cnt[o.name] = base[o.name] || 0;
    monthCount[o.name] = 0;
  });

  // Função de seleção: pega o menos escalado
  const pick = (pool: string[], used: string[], type: string | null = null, absentList: string[] = []): string | null => {
    let av = pool.filter(p => !used.includes(p) && !absentList.includes(p));
    if (type && type !== 'domingo') av = av.filter(p => !ob(p)?.domingoOnly);
    if (maxPerPerson > 0) av = av.filter(p => (monthCount[p] || 0) < maxPerPerson);
    // Excluir obreiros com maxCultos individual atingido
    av = av.filter(p => {
      const worker = ob(p);
      if (worker?.maxCultos && worker.maxCultos > 0) {
        return (monthCount[p] || 0) < worker.maxCultos;
      }
      return true;
    });
    if (!av.length) return null;
    av.sort((a, b) => (cnt[a] || 0) - (cnt[b] || 0));
    const p = av[0];
    cnt[p] = (cnt[p] || 0) + 1;
    monthCount[p] = (monthCount[p] || 0) + 1;
    return p;
  };

  // Distribuir isDomingo1x entre domingos
  const suns = cultos.filter(c => c.type === 'domingo');
  const d1x: Record<number, string> = {};
  W1X.forEach((n, i) => {
    if (i < suns.length) d1x[suns[i].id] = n;
  });

  const result: ScheduleEntry[] = cultos.map(culto => {
    const ov = overrides[culto.date] || {};
    const absentNames = absences[culto.date] ? Object.keys(absences[culto.date]) : [];
    const used: string[] = [];

    const add = (...ns: (string | string[] | null | undefined)[]) => {
      ns.flat().filter(Boolean).forEach(n => {
        if (n && !used.includes(n)) used.push(n);
      });
    };

    const s: ScheduleSlots = {};

    const applySlot = (key: keyof ScheduleSlots, autoFn: () => void) => {
      if (key in ov) {
        (s as Record<string, unknown>)[key] = ov[key];
        const val = ov[key];
        if (Array.isArray(val)) add(...val);
        else if (val) add(val);
      } else {
        autoFn();
      }
    };

    // COORDENAÇÃO: rotação do pool
    applySlot('coordenacao', () => {
      if (COORD.length > 0) {
        const p = COORD[culto.id % COORD.length];
        s.coordenacao = p;
        add(p);
      }
    });

    // SANTA CEIA: somente no primeiro domingo (santaCeia === true)
    if (culto.santaCeia) {
      applySlot('santaCeia', () => {
        const ceia: string[] = [];
        while (ceia.length < 7) {
          const p = pick(SANTA_CEIA_POOL, [...used, ...ceia], culto.type, absentNames);
          if (!p) break;
          ceia.push(p);
        }
        s.santaCeia = ceia;
        add(...ceia);
      });
    }

    // VISITANTES F: rotação do pool
    applySlot('visitantesF', () => {
      if (VISITF.length > 0) {
        const p = VISITF[culto.id % VISITF.length];
        s.visitantesF = p;
        add(p);

        // segueVisitantesF: obreiro que segue quando esta obreira está escalada
        const seguidor = OBR.find(o => o.segueVisitantesF === p && !o.excluido);
        if (seguidor && !used.includes(seguidor.name) && !absentNames.includes(seguidor.name)) {
          // Verifica se é domingo (ou se não é domingoOnly)
          if (culto.type === 'domingo' || !seguidor.domingoOnly) {
            s.visitantesM = seguidor.name;
            add(seguidor.name);
          }
        }
      }
    });

    // VISITANTES M (se não preenchido por segueVisitantesF)
    applySlot('visitantesM', () => {
      if (!s.visitantesM) {
        const p = pick(MG, used, culto.type, absentNames);
        s.visitantesM = p || undefined;
        add(p);
      }
    });

    // PORTA LATERAL: obreiros fixos
    applySlot('portaLateral', () => {
      const pl = PORTA.filter(p => !absentNames.includes(p));
      s.portaLateral = pl;
      add(...pl);
    });

    // PÚLPITO: precisa de pelo menos 1 DC
    applySlot('pulpito', () => {
      const p: string[] = [];
      // Primeiro, um DC
      const dc = pick(DCP, used, culto.type, absentNames);
      if (dc) p.push(dc);
      // Depois completa até 3
      while (p.length < 3) {
        const n = pick(MP, [...used, ...p], culto.type, absentNames);
        if (!n) break;
        p.push(n);
      }
      s.pulpito = p;
      add(...p);

      // Validação: pelo menos 1 DC no púlpito
      if (!p.some(name => ob(name)?.cargo === 'DC')) {
        warnings.push(`${culto.date}: Púlpito sem Diácono`);
      }
    });

    // RECEPÇÃO: prioridade para isDomingo1x no domingo correspondente
    applySlot('recepcao', () => {
      const r: string[] = [];
      // isDomingo1x: atribuir ao domingo correspondente
      const d1 = d1x[culto.id];
      if (d1 && !used.includes(d1) && !absentNames.includes(d1)) {
        r.push(d1);
        cnt[d1] = (cnt[d1] || 0) + 1;
        monthCount[d1] = (monthCount[d1] || 0) + 1;
      }
      // TerçaQuinta: incluir em terça/quinta
      if (culto.type === 'terca' || culto.type === 'quinta') {
        for (const name of WTQ) {
          if (r.length >= 2) break;
          if (!used.includes(name) && !r.includes(name) && !absentNames.includes(name)) {
            r.push(name);
            cnt[name] = (cnt[name] || 0) + 1;
            monthCount[name] = (monthCount[name] || 0) + 1;
          }
        }
      }
      // Completar com pool geral
      while (r.length < 2) {
        const n = pick(WG, [...used, ...r], culto.type, absentNames);
        if (!n) break;
        r.push(n);
      }
      s.recepcao = r;
      add(...r);
    });

    // BANHEIRO MASCULINO
    applySlot('banheiroM', () => {
      const p = pick(MG, used, culto.type, absentNames);
      s.banheiroM = p || undefined;
      add(p);
    });

    // BANHEIRO FEMININO
    applySlot('banheiroF', () => {
      const p = pick(WG, used, culto.type, absentNames);
      s.banheiroF = p || undefined;
      add(p);
    });

    // FRENTE DA IGREJA
    applySlot('frenteIgreja', () => {
      const f: string[] = [];
      // Primeiro obreiros com frenteOnly
      for (const name of FRENTE) {
        if (f.length >= 2) break;
        if (!used.includes(name) && !absentNames.includes(name)) {
          f.push(name);
          cnt[name] = (cnt[name] || 0) + 1;
          monthCount[name] = (monthCount[name] || 0) + 1;
        }
      }
      // Completar com pool geral feminino
      while (f.length < 2) {
        const n = pick(WG_FRENTE, [...used, ...f], culto.type, absentNames);
        if (!n) break;
        f.push(n);
      }
      s.frenteIgreja = f;
      add(...f);
    });

    // pairWith: trazer o par junto quando escalado
    for (const name of used) {
      const worker = ob(name);
      if (worker?.pairWith) {
        const pair = ob(worker.pairWith);
        if (pair && !pair.excluido && !used.includes(pair.name) && !absentNames.includes(pair.name)) {
          // Encontra a função do obreiro e coloca o par na mesma
          for (const [key, val] of Object.entries(s)) {
            if (Array.isArray(val) && val.includes(name)) {
              val.push(pair.name);
              add(pair.name);
              cnt[pair.name] = (cnt[pair.name] || 0) + 1;
              monthCount[pair.name] = (monthCount[pair.name] || 0) + 1;
              break;
            }
          }
        }
      }
    }

    return { culto, slots: s };
  });

  return { schedule: result, newContagem: cnt, warnings };
}

/**
 * Validação da escala - gera alertas e avisos
 */
export function validateSchedule(
  schedule: ScheduleEntry[],
  obreiros: Obreiro[]
): { errors: string[]; warnings: string[] } {
  const errors: string[] = [];
  const warnings: string[] = [];
  const ob = (n: string) => obreiros.find(o => o.name === n);

  schedule.forEach(({ culto, slots }) => {
    // Verificar DC no púlpito
    if (slots.pulpito && slots.pulpito.length > 0) {
      if (!slots.pulpito.some(n => ob(n)?.cargo === 'DC')) {
        errors.push(`🔴 ${culto.date} (${culto.weekday}): Púlpito sem Diácono`);
      }
    }

    // Verificar Santa Ceia com 7 DCs
    if (culto.santaCeia && slots.santaCeia) {
      if (slots.santaCeia.length < 7) {
        warnings.push(`⚠️ ${culto.date}: Santa Ceia com apenas ${slots.santaCeia.length} de 7 DCs`);
      }
      const nonDC = slots.santaCeia.filter(n => ob(n)?.cargo !== 'DC');
      if (nonDC.length > 0) {
        errors.push(`🔴 ${culto.date}: Santa Ceia com não-DC: ${nonDC.join(', ')}`);
      }
    }

    // Verificar visitantes F vazio
    if (!slots.visitantesF) {
      warnings.push(`⚠️ ${culto.date} (${culto.weekday}): Visitantes ♀ sem ninguém`);
    }

    // Verificar duplicatas
    const allNames: string[] = [];
    Object.values(slots).forEach(val => {
      if (Array.isArray(val)) allNames.push(...val);
      else if (val) allNames.push(val as string);
    });
    const dups = allNames.filter((n, i) => allNames.indexOf(n) !== i);
    if (dups.length > 0) {
      errors.push(`🔴 ${culto.date}: Obreiro(s) duplicado(s): ${[...new Set(dups)].join(', ')}`);
    }
  });

  return { errors, warnings };
}
