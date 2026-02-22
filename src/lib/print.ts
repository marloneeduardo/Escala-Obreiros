import { ScheduleEntry, Obreiro, EbdData } from '../types';
import { FM, CARGO_COLOR, MESES_LABELS } from '../config/constants';

export function printSchedule(
  schedule: ScheduleEntry[],
  obreiros: Obreiro[],
  mes: number,
  ano: number
) {
  const ob = (n: string) => obreiros.find(o => o.name === n);
  const mesLabel = MESES_LABELS[mes - 1];

  const cultoCards = schedule.map(({ culto, slots }) => {
    const rows = FM
      .filter(m => {
        if (m.santaCeiaOnly && !culto.santaCeia) return false;
        return true;
      })
      .map(m => {
        const key = m.key as keyof typeof slots;
        const val = slots[key];
        const names = Array.isArray(val) ? val : val ? [val] : [];
        if (names.length === 0) return '';
        return `
          <tr>
            <td style="font-weight:700;color:${m.color};padding:6px 10px;vertical-align:top;width:180px;border-bottom:1px solid #eee">
              ${m.icon} ${m.label}
            </td>
            <td style="padding:6px 10px;border-bottom:1px solid #eee">
              ${names.map(n => {
                const o = ob(n);
                const c = CARGO_COLOR[o?.cargo || 'CP'];
                return `<span style="display:inline-block;background:${c}20;color:${c};border:1px solid ${c}40;border-radius:6px;padding:3px 8px;margin:2px;font-size:12px;font-weight:600">${n}</span>`;
              }).join(' ')}
            </td>
          </tr>
        `;
      })
      .filter(Boolean)
      .join('');

    return `
      <div style="break-inside:avoid;margin-bottom:20px;border:1px solid #ddd;border-radius:10px;overflow:hidden">
        <div style="background:#4f46e5;color:white;padding:10px 15px;font-weight:700;font-size:14px">
          ${culto.weekday}, ${culto.date}${culto.label ? ` — ${culto.label}` : ''}${culto.santaCeia ? ' 🍷 Santa Ceia' : ''}
        </div>
        <table style="width:100%;border-collapse:collapse">${rows}</table>
      </div>
    `;
  }).join('');

  const html = `<!DOCTYPE html>
<html><head><meta charset="UTF-8"><title>Escala dos Obreiros - ${mesLabel} ${ano}</title>
<style>
  body{font-family:Arial,sans-serif;margin:20px;color:#333}
  h1{text-align:center;color:#4f46e5;margin-bottom:5px}
  h2{text-align:center;color:#666;font-weight:400;margin-bottom:30px}
  @media print{body{margin:10px}h1{font-size:18px}h2{font-size:14px}}
</style></head><body>
<h1>⛪ Escala dos Obreiros — Sede</h1>
<h2>${mesLabel} de ${ano}</h2>
${cultoCards}
</body></html>`;

  const w = window.open('', '_blank');
  if (w) {
    w.document.write(html);
    w.document.close();
    setTimeout(() => w.print(), 500);
  }
}

export function printEbd(ebdData: EbdData, mes: number, ano: number) {
  const mesLabel = MESES_LABELS[mes - 1];

  const classRows = ebdData.classes.map(cls => {
    const rows = cls.rows.map((r, i) => `
      <tr>
        ${i === 0 ? `<td rowspan="${cls.rows.length}" style="background:${cls.color}15;color:${cls.color};font-weight:700;padding:10px;border:1px solid #c97d2c;vertical-align:middle;text-align:center;width:180px">
          ${cls.nome}<br><small style="font-weight:400;opacity:.7">${cls.sub}</small>
        </td>` : ''}
        <td style="padding:8px;border:1px solid #c97d2c;text-align:center">${r.data}</td>
        <td style="padding:8px;border:1px solid #c97d2c;text-align:center">${r.licao}</td>
        <td style="padding:8px;border:1px solid #c97d2c">${r.prof}</td>
      </tr>
    `).join('');
    return rows;
  }).join('');

  const html = `<!DOCTYPE html>
<html><head><meta charset="UTF-8"><title>EBD - ${mesLabel} ${ano}</title>
<style>
  body{font-family:Arial,sans-serif;margin:20px;color:#333}
  table{width:100%;border-collapse:collapse;margin-top:15px}
  th{background:linear-gradient(135deg,#92400e,#d97706);color:white;padding:10px;border:1px solid #c97d2c}
  @media print{body{margin:10px}}
</style></head><body>
<div style="text-align:center;background:linear-gradient(135deg,#92400e,#d97706,#92400e);color:white;padding:20px;border-radius:10px;margin-bottom:20px">
  <h2 style="margin:0">📖 Escola Bíblica Dominical</h2>
  <p style="margin:5px 0">ADJIPA — ${mesLabel} de ${ano}</p>
</div>

<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;margin-bottom:15px">
  <div><strong>1º Superintendente:</strong> ${ebdData.sup1}</div>
  <div><strong>2º Superintendente:</strong> ${ebdData.sup2}</div>
  <div><strong>3º Superintendente:</strong> ${ebdData.sup3}</div>
</div>
<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:5px">
  <div><strong>Secretaria:</strong> ${ebdData.secretaria}</div>
  <div><strong>Tesoureira:</strong> ${ebdData.tesoureira}</div>
</div>
<p style="font-style:italic;color:#666;margin-bottom:15px">Dc. Rosimar Alves Ferreira</p>

<table>
  <thead>
    <tr>
      <th>CLASSES</th>
      <th>DATAS</th>
      <th>LIÇÕES</th>
      <th>PROFESSORES</th>
    </tr>
  </thead>
  <tbody>${classRows}</tbody>
</table>
</body></html>`;

  const w = window.open('', '_blank');
  if (w) {
    w.document.write(html);
    w.document.close();
    setTimeout(() => w.print(), 500);
  }
}
