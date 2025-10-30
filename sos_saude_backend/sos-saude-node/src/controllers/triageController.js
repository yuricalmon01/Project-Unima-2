import * as svc from '../services/triageService.js';

export async function criar(req,res){ try{ const t=await svc.abrirTicket(req.body); res.status(201).json(t);}catch(e){res.status(400).json({error:e.message});} }
export async function fila(req,res){ try{ res.json(await svc.listarFila()); }catch(e){ res.status(500).json({error:e.message}); } }
export async function proximo(req,res){ try{ const t=await svc.chamarProximo(req.user?.id||null); if(!t)return res.status(404).json({error:'Fila vazia'}); res.json(t);}catch(e){res.status(500).json({error:e.message});} }
export async function atualizar(req,res){ try{ const t=await svc.atualizarTicket(req.params.id, req.body); if(!t)return res.status(404).json({error:'Ticket não encontrado ou sem mudanças'}); res.json(t);}catch(e){res.status(400).json({error:e.message});} }
export async function obter(req,res){ try{ const t=await svc.obterTicket(req.params.id); if(!t)return res.status(404).json({error:'Ticket não encontrado'}); res.json(t);}catch(e){res.status(500).json({error:e.message});} }
export async function remover(req,res){ try{ const ok=await svc.deletarTicket(req.params.id); if(!ok)return res.status(404).json({error:'Ticket não encontrado'}); res.json({ok:true}); }catch(e){res.status(500).json({error:e.message});} }
