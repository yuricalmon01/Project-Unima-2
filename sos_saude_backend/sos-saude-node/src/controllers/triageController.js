// const notificationService = require('../../../notifications/notificationService');
import { success, error } from '../utils/response.js';
// const triageService = require('../services/triageService');

// Criar novo ticket de triagem
async function criar(req, res) {
  try {
    return error(res, 'Endpoint não implementado ainda', 501);
  } catch (err) {
    console.error(err);
    return error(res, 'Erro ao criar ticket', 500);
  }
}

// Obter ticket por ID
async function obter(req, res) {
  try {
    return error(res, 'Endpoint não implementado ainda', 501);
  } catch (err) {
    console.error(err);
    return error(res, 'Erro ao buscar ticket', 500);
  }
}

// Atualizar status do ticket
async function atualizar(req, res) {
  try {
    return error(res, 'Endpoint não implementado ainda', 501);
  } catch (err) {
    console.error(err);
    return error(res, 'Erro ao atualizar ticket', 500);
  }
}

// Remover ticket
async function remover(req, res) {
  try {
    return error(res, 'Endpoint não implementado ainda', 501);
  } catch (err) {
    console.error(err);
    return error(res, 'Erro ao remover ticket', 500);
  }
}

// Obter fila de triagens
async function fila(req, res) {
  try {
    return error(res, 'Endpoint não implementado ainda', 501);
  } catch (err) {
    console.error(err);
    return error(res, 'Erro ao buscar fila', 500);
  }
}

// Próximo ticket na fila
async function proximo(req, res) {
  try {
    return error(res, 'Endpoint não implementado ainda', 501);
  } catch (err) {
    console.error(err);
    return error(res, 'Erro ao obter próximo ticket', 500);
  }
}

export {
  criar,
  obter,
  atualizar,
  remover,
  fila,
  proximo
};
