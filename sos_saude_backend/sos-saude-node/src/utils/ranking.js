const BASE = { vermelho: Infinity, laranja: 100, amarelo: 70, verde: 40, azul: 10 };
const SUS = { idoso: 10, gestante: 15, lactante: 8, pcd: 12, criancaColo: 15 };
const K_ESPERA = 1;
export function minutosEspera(date){ const t = new Date(date).getTime(); return Math.max(0, Math.floor((Date.now()-t)/60000)); }
export function scoreTicket(t, age){
  if(t.risk==='vermelho') return Number.POSITIVE_INFINITY;
  let s = BASE[t.risk]||0;
  if(age>=60) s+=SUS.idoso;
  if(t.gestante) s+=SUS.gestante;
  if(t.lactante) s+=SUS.lactante;
  if(t.pcd) s+=SUS.pcd;
  if(t.crianca_colo) s+=SUS.criancaColo;
  s += minutosEspera(t.created_at)*K_ESPERA;
  return s;
}
