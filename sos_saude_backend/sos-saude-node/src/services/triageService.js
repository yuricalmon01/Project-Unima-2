import { pool } from '../db/pool.js';
import { scoreTicket } from '../utils/ranking.js';

export async function abrirTicket({ patient_id, risk='verde', gestante=false, lactante=false, pcd=false, crianca_colo=false, notes=null }){
  const [ins] = await pool.query(
    `INSERT INTO triage_tickets (patient_id,risk,gestante,lactante,pcd,crianca_colo,notes)
     VALUES (:patient_id,:risk,:gestante,:lactante,:pcd,:crianca_colo,:notes)`,
    { patient_id, risk, gestante, lactante, pcd, crianca_colo, notes }
  );
  const [t] = await pool.query('SELECT * FROM triage_tickets WHERE id=:id',{ id: ins.insertId });
  return t[0];
}

export async function listarFila(){
  const [rows] = await pool.query(`
    SELECT t.*, TIMESTAMPDIFF(YEAR, u.birth_date, CURDATE()) as idade
    FROM triage_tickets t
    JOIN patients p ON p.id = t.patient_id
    JOIN users u ON u.id = p.user_id
    WHERE t.status='na_fila'
    ORDER BY t.created_at ASC
  `);
  const ordenada = rows.map(r=>({...r, score: scoreTicket(r, r.idade||0)}))
    .sort((a,b)=> (b.score - a.score) || (new Date(a.created_at) - new Date(b.created_at)));
  return ordenada;
}

export async function chamarProximo(professional_user_id=null){
  const fila = await listarFila();
  const first = fila[0];
  if(!first) return null;
  await pool.query('UPDATE triage_tickets SET status="atendido", called_at=NOW(), finished_at=NOW() WHERE id=:id',{ id:first.id });
  await pool.query('INSERT INTO triage_attendances (ticket_id, professional_user_id, started_at, finished_at, outcome) VALUES (:tid,:uid,NOW(),NOW(),"encaminhado")',{ tid:first.id, uid:professional_user_id });
  return first;
}

export async function atualizarTicket(id, data){
  const fields = ['risk','gestante','lactante','pcd','crianca_colo','notes','status'];
  const set = []; const params = { id };
  for(const f of fields){ if(data[f]!==undefined){ set.push(`${f} = :${f}`); params[f]=data[f]; } }
  if(!set.length) return null;
  await pool.query(`UPDATE triage_tickets SET ${set.join(', ')} WHERE id=:id`, params);
  const [t] = await pool.query('SELECT * FROM triage_tickets WHERE id=:id',{ id });
  return t[0];
}

export async function obterTicket(id){
  const [t] = await pool.query('SELECT * FROM triage_tickets WHERE id=:id',{ id });
  return t[0]||null;
}

export async function deletarTicket(id){
  const [r] = await pool.query('DELETE FROM triage_tickets WHERE id=:id',{ id });
  return r.affectedRows>0;
}
