import { useMemo } from 'react';
import { Obreiro, Config, Contagem, Overrides, Absences, ScheduleEntry } from '../types';
import { gerarCultos, buildSchedule, validateSchedule } from '../lib/schedule';

export function useSchedule(
  obreiros: Obreiro[],
  config: Config,
  contagem: Contagem,
  overrides: Overrides,
  absences: Absences
) {
  const cultos = useMemo(
    () => gerarCultos(config.mes, config.ano, config.schedConf, config.labels),
    [config.mes, config.ano, config.schedConf, config.labels]
  );

  const { schedule, newContagem, warnings: buildWarnings } = useMemo(
    () => buildSchedule(obreiros, cultos, contagem, overrides, absences, config.maxPerPerson),
    [obreiros, cultos, contagem, overrides, absences, config.maxPerPerson]
  );

  const { errors, warnings: validationWarnings } = useMemo(
    () => validateSchedule(schedule, obreiros),
    [schedule, obreiros]
  );

  return {
    cultos,
    schedule,
    newContagem,
    errors,
    warnings: [...buildWarnings, ...validationWarnings],
  };
}
