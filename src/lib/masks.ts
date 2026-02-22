export const maskDate = (v = ''): string => {
  const d = v.replace(/\D/g, '').slice(0, 8);
  if (d.length <= 2) return d;
  if (d.length <= 4) return `${d.slice(0, 2)}/${d.slice(2)}`;
  return `${d.slice(0, 2)}/${d.slice(2, 4)}/${d.slice(4)}`;
};

export const maskPhone = (v = ''): string => {
  const d = v.replace(/\D/g, '').slice(0, 11);
  if (d.length <= 2) return d.length ? `(${d}` : '';
  if (d.length <= 7) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
};

export const isValidDate = (s = ''): boolean => {
  if (!s || s.length < 10) return false;
  const [dd, mm, yyyy] = s.split('/').map(Number);
  const date = new Date(yyyy, mm - 1, dd);
  return date.getFullYear() === yyyy && date.getMonth() === mm - 1 && date.getDate() === dd;
};

export const isValidPhone = (s = ''): boolean => s === '' || /^\(\d{2}\) \d{4,5}-\d{4}$/.test(s);

export const getLast4Digits = (tel: string): string => tel.replace(/\D/g, '').slice(-4);
